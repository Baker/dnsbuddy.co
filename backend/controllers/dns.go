package controllers

import (
	"backend/models"
	"backend/utils"
	"go.uber.org/zap"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/projectdiscovery/dnsx/libs/dnsx"
	"time"
)

func DNSLookup(c *gin.Context) {
	var startTime = time.Now()
	var req models.DNSRecordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recordType, err := utils.RecordTypeToUint16(req.Type)
	if err != nil {
		utils.Logger.Error("Failed to convert record type", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dnsProviders, err := utils.FetchDnsProvider(req.Provider)
	if err != nil {
		utils.Logger.Error("Failed to fetch DNS providers", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DNS providers"})
		return
	}

	dnsxOptions := dnsx.Options{
		BaseResolvers: dnsProviders,
		QuestionTypes: []uint16{recordType},
		MaxRetries:    2,
	}
	dnsxClient, err := dnsx.New(dnsxOptions)
	if err != nil {
		utils.Logger.Error("Failed to initialize DNSX", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
		return
	}

	result, err := dnsxClient.QueryMultiple(req.Query)
	if err != nil {
		utils.Logger.Error("DNS lookup failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
		return
	}

	records, err := utils.ParseRecords(result, string(req.Type))
	if err != nil {
		utils.Logger.Error("Failed to parse DNS records", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse DNS records"})
		return
	}

	response := models.DNSRecordResponse{
		Host:       result.Host,
		Type:       req.Type,
		Resolver:   result.Resolver,
		Records:    records,
		TTL:        result.TTL,
		StatusCode: result.StatusCode,
		Timestamp:  result.Timestamp,
		TotalTime:  time.Since(startTime),
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}

func DNSLookupAllProviders(c *gin.Context) {
	var startTime = time.Now()
	var req models.DNSRecordRequestAllProviders
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recordType, err := utils.RecordTypeToUint16(req.Type)
	if err != nil {
		utils.Logger.Error("Failed to convert record type", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	records := []models.DNSRecordProviderPairing{}

	for _, provider := range models.AllDNSProviders {
		dnsProviders, err := utils.FetchDnsProvider(provider)
		if err != nil {
			utils.Logger.Error("Failed to fetch DNS providers", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DNS providers"})
			return
		}
		dnsxOptions := dnsx.Options{
			BaseResolvers: dnsProviders,
			QuestionTypes: []uint16{recordType},
			MaxRetries:    1,
		}
		dnsxClient, err := dnsx.New(dnsxOptions)
		if err != nil {
			utils.Logger.Error("Failed to initialize DNSX", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
			return
		}

		result, err := dnsxClient.QueryMultiple(req.Query)
		if err != nil {
			utils.Logger.Error("DNS lookup failed", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
			return
		}

		parsedRecords, err := utils.ParseRecords(result, string(req.Type))
		if err != nil {
			utils.Logger.Error("Failed to parse DNS records", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse DNS records"})
			return
		}

		records = append(records, models.DNSRecordProviderPairing{
			Provider:   provider,
			Record:     parsedRecords,
			StatusCode: result.StatusCode,
		})
	}

	response := models.DNSRecordResponseAllProviders{
		Host:      req.Query,
		Type:      req.Type,
		Records:   records,
		Timestamp: time.Now(),
		TotalTime: time.Since(startTime),
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}

func DNSLookupOverview(c *gin.Context) {
	var startTime = time.Now()
	var req models.DNSRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	recordTypes := []models.RecordType{
		models.A,
		models.AAAA,
		models.CNAME,
		models.MX,
		models.NS,
		models.SOA,
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
	dnsxOptions.MaxRetries = 1
	dnsxOptions.QuestionTypes = questionTypes

	dnsxClient, err := dnsx.New(dnsxOptions)
	if err != nil {
		utils.Logger.Error("Failed to initialize DNSX", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
		return
	}

	result, err := dnsxClient.QueryMultiple(req.Query)
	if err != nil {
		utils.Logger.Error("DNS lookup failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
		return
	}

	records := models.DNSRecords{}
	if result.StatusCode != "NXDOMAIN" {
		for _, rt := range recordTypes {
			parsedRecords, err := utils.ParseRecords(result, string(rt))
			if err != nil {
				utils.Logger.Error("Failed to parse DNS records", zap.Error(err))
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse DNS records"})
				return
			}

			recordMap := map[models.RecordType]interface{}{
				models.A:     &records.A,
				models.AAAA:  &records.AAAA,
				models.CNAME: &records.CNAME,
				models.MX:    &records.MX,
				models.NS:    &records.NS,
				models.SOA:   &records.SOA,
				models.TXT:   &records.TXT,
			}

			if slice, ok := recordMap[rt]; ok {
				switch s := slice.(type) {
				case *[]string:
					*s = append(*s, parsedRecords.A...)
				case *[]models.MXRecord:
					*s = append(*s, parsedRecords.MX...)
				case *[]models.SOARecord:
					*s = append(*s, parsedRecords.SOA...)
				}
			}
		}
	}

	response := models.DNSRecordResponse{
		Host:       result.Host,
		Resolver:   result.Resolver,
		Records:    records,
		TTL:        result.TTL,
		StatusCode: result.StatusCode,
		Timestamp:  result.Timestamp,
		TotalTime:  time.Since(startTime),
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}
