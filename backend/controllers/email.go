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

	recordTypes := []models.RecordType{
		models.TXT,
	}
	var questionTypes []uint16
	for _, rt := range recordTypes {
		u16, err := utils.RecordTypeToUint16(rt)
		if err != nil {
			utils.Logger.Error("Failed to convert record type", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert record type"})
			return
		}
		questionTypes = append(questionTypes, u16)
	}

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
	var wg sync.WaitGroup
	errChan := make(chan error, len(spfRecord.Include))

	var processInclude func(domain string, depth int) models.ExtendedSpf
	processInclude = func(domain string, depth int) models.ExtendedSpf {
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
			Qualifier: subRecord.Qualifier,
			IPv4:      subRecord.IPv4,
			IPv6:      subRecord.IPv6,
			MX:        subRecord.MX,
			PTR:       subRecord.PTR,
			A:         subRecord.A,
			Include:   make(map[string]models.ExtendedSpf),
			Exists:    subRecord.Exists,
		}

		for _, subDomain := range subRecord.Include {
			wg.Add(1)
			subInclude := processInclude(subDomain, depth+1)
			extendedSubRecord.Include[subDomain] = subInclude
		}
		lookups++
		return extendedSubRecord
	}

	for _, domain := range spfRecord.Include {
		wg.Add(1)
		go func(d string) {
			extendedInclude[d] = processInclude(d, 1)
		}(domain)
	}

	wg.Wait()
	close(errChan)
	for err := range errChan {
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	extendedSpfRecord := models.ExtendedSpfRecord{
		Qualifier: spfRecord.Qualifier,
		IPv4:      spfRecord.IPv4,
		IPv6:      spfRecord.IPv6,
		MX:        spfRecord.MX,
		PTR:       spfRecord.PTR,
		A:         spfRecord.A,
		Include:   extendedInclude,
		Exists:    spfRecord.Exists,
	}

	response := models.ExtendedSpfRecordResponse{
		Lookups:   lookups,
		SPF:       spfs,
		Time:      time.Since(startTime),
		Breakdown: extendedSpfRecord,
	}
	c.JSON(http.StatusOK, response)
}
