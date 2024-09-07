package controllers

import (
	"backend/models"
	"backend/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/projectdiscovery/dnsx/libs/dnsx"
	"go.uber.org/zap"
	"net/http"
	"strings"
	"sync"
	"time"
)

func BreakDownSpf(c *gin.Context) {
	var startTime = time.Now()
	var body models.DNSRecordRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	questionType, err := utils.RecordTypeToUint16(models.TXT)
	if err != nil {
		utils.Logger.Error("Failed to convert record type", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert record type"})
		return
	}
	questionTypes := []uint16{questionType}

	dnsxOptions := dnsx.DefaultOptions
	dnsxOptions.MaxRetries = 2
	dnsxOptions.QuestionTypes = questionTypes
	dnsxClient, err := dnsx.New(dnsxOptions)
	if err != nil {
		utils.Logger.Error("Failed to initialize DNSX", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
		return
	}

	result, err := dnsxClient.QueryMultiple(body.Query)
	if err != nil {
		utils.Logger.Error("DNS lookup failed", zap.Error(err), zap.Any("resolver", result.Resolver))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
		return
	}

	var spfs string
	lookups := 0
	for _, txt := range result.TXT {
		txt = strings.ToLower(txt)
		if txt == "v=spf1" || strings.HasPrefix(txt, "v=spf1 ") {
			spfs = txt
		}
	}
	if len(spfs) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No SPF record found", "time": time.Since(startTime)})
		return
	}
	spfRecord := utils.BreakDownSpf(spfs)
	extendedInclude := make(map[string]models.ExtendedSpf)
	extendedRedirect := make(map[string]models.ExtendedSpf)
	extendedExplanation := make(map[string]string)
	var wg sync.WaitGroup
	errChan := make(chan error, len(spfRecord.Include)+len(spfRecord.Redirect))

	var processRecord func(domain string, depth int, isRedirect bool) models.ExtendedSpf
	processRecord = func(domain string, depth int, isRedirect bool) models.ExtendedSpf {
		defer wg.Done()

		result, err := dnsxClient.QueryMultiple(domain)
		if err != nil {
			utils.Logger.Error("DNS lookup failed", zap.Error(err), zap.Any("resolver", result.Resolver))
			errChan <- fmt.Errorf("DNS lookup failed for domain %s: %v", domain, err)
			return models.ExtendedSpf{}
		}

		var domainSpf string
		for _, txt := range result.TXT {
			txt = strings.ToLower(txt)
			if txt == "v=spf1" || strings.HasPrefix(txt, "v=spf1 ") {
				domainSpf = txt
				break
			}
		}

		if domainSpf == "" {
			return models.ExtendedSpf{}
		}

		subRecord := utils.BreakDownSpf(domainSpf)
		extendedSubRecord := models.ExtendedSpf{
			Qualifier:   subRecord.Qualifier,
			IPv4:        subRecord.IPv4,
			IPv6:        subRecord.IPv6,
			MX:          subRecord.MX,
			PTR:         subRecord.PTR,
			A:           subRecord.A,
			Include:     make(map[string]models.ExtendedSpf),
			Exists:      subRecord.Exists,
			Redirect:    make(map[string]models.ExtendedSpf),
			Explanation: make(map[string]string),
		}

		for _, subDomain := range subRecord.Include {
			wg.Add(1)
			subInclude := processRecord(subDomain, depth+1, false)
			extendedSubRecord.Include[subDomain] = subInclude
		}

		if !isRedirect {
			for _, redirectDomain := range subRecord.Redirect {
				wg.Add(1)
				redirectRecord := processRecord(redirectDomain, depth+1, true)
				extendedRedirect[redirectDomain] = redirectRecord
			}
		}

		lookups++
		return extendedSubRecord
	}

	for _, domain := range spfRecord.Include {
		wg.Add(1)
		go func(d string) {
			extendedInclude[d] = processRecord(d, 1, false)
		}(domain)
	}

	for _, domain := range spfRecord.Redirect {
		wg.Add(1)
		go func(d string) {
			extendedRedirect[d] = processRecord(d, 1, true)
		}(domain)
	}

	for _, explanation := range spfRecord.Explanation {
		result, err := dnsxClient.QueryMultiple(explanation)
		if err != nil {
			utils.Logger.Error("DNS lookup failed", zap.Error(err), zap.Any("resolver", result.Resolver))
			errChan <- fmt.Errorf("DNS lookup failed for domain %s: %v", explanation, err)
			extendedExplanation[explanation] = "DNS lookup failed"
		}
		extendedExplanation[explanation] = result.TXT[0]
	}

	wg.Wait()
	close(errChan)
	for err := range errChan {
		if err != nil {
			utils.Logger.Error("DNS lookup failed", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
			return
		}
	}

	extendedSpfRecord := models.ExtendedSpfRecord{
		Qualifier:   spfRecord.Qualifier,
		IPv4:        spfRecord.IPv4,
		IPv6:        spfRecord.IPv6,
		MX:          spfRecord.MX,
		PTR:         spfRecord.PTR,
		A:           spfRecord.A,
		Include:     extendedInclude,
		Exists:      spfRecord.Exists,
		Redirect:    extendedRedirect,
		Explanation: extendedExplanation,
	}

	response := models.ExtendedSpfRecordResponse{
		Lookups:   lookups,
		SPF:       spfs,
		Timestamp: time.Now(),
		TotalTime: time.Since(startTime),
		Breakdown: extendedSpfRecord,
	}
	c.JSON(http.StatusOK, response)
}

func ValidateDmarc(c *gin.Context) {
	var startTime = time.Now()
	var body models.DNSRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Check if the query starts with "_dmarc", if not, prepend it
	if !strings.HasPrefix(body.Query, "_dmarc") {
		body.Query = "_dmarc." + body.Query
	}

	rawDomain := strings.Split(body.Query, "_dmarc.")[1]

	questionType, err := utils.RecordTypeToUint16(models.TXT)
	if err != nil {
		utils.Logger.Error("Failed to convert record type", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert record type"})
		return
	}
	questionTypes := []uint16{questionType}

	dnsxOptions := dnsx.DefaultOptions
	dnsxOptions.MaxRetries = 2
	dnsxOptions.QuestionTypes = questionTypes

	dnsxClient, err := dnsx.New(dnsxOptions)
	if err != nil {
		utils.Logger.Error("Failed to initialize DNSX", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
		return
	}

	result, err := dnsxClient.QueryMultiple(body.Query)
	if err != nil {
		utils.Logger.Error("DMARC DNS lookup failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DMARC DNS lookup failed"})
		return
	}

	if len(result.TXT) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No DMARC record found"})
		return
	}

	// Check if the first TXT record starts with "v=DMARC1" and contains "p="
	if !strings.HasPrefix(strings.ToLower(result.TXT[0]), "v=dmarc1") || !strings.Contains(strings.ToLower(result.TXT[0]), "p=") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DMARC record format"})
		return
	}

	record := utils.BreakDownDmarc(result.TXT[0])
	externalReporting := []models.DmarcExternalReporting{}
	for _, address := range append(record.RUA, record.RUF...) {
		externalDomain, err := utils.ParseDmarcReportingAddress(rawDomain, address)
		if err != nil {
			utils.Logger.Error("DMARC External Domain", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DMARC External Domain"})
			return
		}
		if externalDomain == "" {
			continue
		}
		result, err := dnsxClient.QueryMultiple(externalDomain)
		if err != nil {
			utils.Logger.Error("DMARC DNS lookup failed", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DMARC DNS lookup failed"})
			return
		}
		externalReporting = append(externalReporting, models.DmarcExternalReporting{
			Domain: externalDomain,
			Record: result.TXT[0],
			Valid:  strings.HasPrefix(strings.ToLower(result.TXT[0]), "v=dmarc1"),
		})
	}

	response := models.DmarcRecordResponse{
		Query:     body.Query,
		Record:    record,
		Raw:       result.TXT[0],
		Timestamp: time.Now(),
		TotalTime: time.Since(startTime),
		External:  externalReporting,
	}
	c.JSON(http.StatusOK, response)
}
