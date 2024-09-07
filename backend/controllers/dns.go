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

// DNSLookup godoc
// @Summary Perform a DNS lookup
// @Description Perform a DNS lookup for a specific query and record type
// @Tags dns
// @Accept json
// @Produce json
// @Param request body models.DNSRecordRequest true "DNS lookup request"
// @Success 200 {object} models.DNSRecordResponse
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /dns [post]
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
		TotalTime:  int(time.Since(startTime).Milliseconds()),
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}

// DNSLookupAllProviders godoc
// @Summary Perform a DNS lookup across all providers
// @Description Perform a DNS lookup for a specific query and record type across all DNS providers
// @Tags dns
// @Accept json
// @Produce json
// @Param request body models.DNSRecordRequestAllProviders true "DNS lookup request for all providers"
// @Success 200 {array} models.DNSRecordProviderPairing
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /dns/all [post]
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
		var startTime = time.Now()
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
			TotalTime:  int(time.Since(startTime).Milliseconds()),
		})
	}

	response := models.DNSRecordResponseAllProviders{
		Host:      req.Query,
		Type:      req.Type,
		Records:   records,
		Timestamp: time.Now(),
		TotalTime: int(time.Since(startTime).Milliseconds()),
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}

// DNSLookupOverview godoc
// @Summary Perform a DNS lookup overview
// @Description Perform a DNS lookup overview for a specific query
// @Tags dns
// @Accept json
// @Produce json
// @Param request body models.DNSRequest true "DNS lookup overview request"
// @Success 200 {object} models.DNSRecordResponse
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /dns/overview [post]
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
	dnsxOptions.MaxRetries = 2
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

			switch rt {
			case models.A:
				records.A = append(records.A, parsedRecords.A...)
			case models.AAAA:
				records.AAAA = append(records.AAAA, parsedRecords.AAAA...)
			case models.CNAME:
				records.CNAME = append(records.CNAME, parsedRecords.CNAME...)
			case models.MX:
				records.MX = append(records.MX, parsedRecords.MX...)
			case models.NS:
				records.NS = append(records.NS, parsedRecords.NS...)
			case models.SOA:
				records.SOA = append(records.SOA, parsedRecords.SOA...)
			case models.TXT:
				records.TXT = append(records.TXT, parsedRecords.TXT...)
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
		TotalTime:  int(time.Since(startTime).Milliseconds()),
	}
	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}
