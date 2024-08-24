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
	var body models.DNSRecordRequest
	var startTime = time.Now()
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recordType, err := utils.RecordTypeToUint16(body.Type)
	if err != nil {
		utils.Logger.Error("Failed to convert record type", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dnsProviders, err := utils.FetchDnsProvider(body.Provider)
	if err != nil {
		utils.Logger.Error("Failed to fetch DNS providers", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DNS providers"})
		return
	}

	dnsxOptions := dnsx.DefaultOptions
	dnsxOptions.BaseResolvers = dnsProviders
	dnsxOptions.QuestionTypes = []uint16{recordType}
	dnsxClient, err := dnsx.New(dnsxOptions)
	if err != nil {
		utils.Logger.Error("Failed to initialize DNSX", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
		return
	}

	result, err := dnsxClient.QueryMultiple(body.Query)
	if err != nil {
		utils.Logger.Error("DNS lookup failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
		return
	}

	records, err := utils.ParseRecords(result, string(body.Type))
	if err != nil {
		utils.Logger.Error("Failed to parse DNS records", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse DNS records"})
		return
	}

	response := models.DNSRecordResponse{
		Host:       result.Host,
		Type:       body.Type,
		Resolver:   result.Resolver,
		Records:    records,
		TTL:        result.TTL,
		StatusCode: result.StatusCode,
		Timestamp:  result.Timestamp,
		TotalTime: time.Since(startTime),
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}

func DNSLookupAllProviders(c *gin.Context) {
	var body models.DNSRecordRequestAllProviders
	var startTime = time.Now()
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recordType, err := utils.RecordTypeToUint16(body.Type)
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
		dnsxOptions := dnsx.DefaultOptions
		dnsxOptions.BaseResolvers = dnsProviders
		dnsxOptions.QuestionTypes = []uint16{recordType}
		dnsxClient, err := dnsx.New(dnsxOptions)
		if err != nil {
			utils.Logger.Error("Failed to initialize DNSX", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
			return
		}

		result, err := dnsxClient.QueryMultiple(body.Query)
		if err != nil {
			utils.Logger.Error("DNS lookup failed", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
			return
		}

		parsedRecords, err := utils.ParseRecords(result, string(body.Type))
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
		Host:      body.Query,
		Type:      body.Type,
		Records:   records,
		Timestamp: time.Now(),
		TotalTime: time.Since(startTime),
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}
