package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/projectdiscovery/dnsx/libs/dnsx"
	"net/http"

	"backend/models"
	"backend/utils"
)

func DNSLookup(c *gin.Context) {
	var body models.DNSRecordRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recordType, err := utils.RecordTypeToUint16(body.Type)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dnsxOptions := dnsx.DefaultOptions
	dnsxOptions.QuestionTypes = []uint16{recordType}
	dnsxClient, err := dnsx.New(dnsxOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize DNSX"})
		return
	}

	result, err := dnsxClient.QueryMultiple(body.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DNS lookup failed"})
		return
	}

	records := models.DNSRecords{}

	switch body.Type {
	case "A":
		records.A = result.A
	case "AAAA":
		records.AAAA = result.AAAA
	case "CNAME":
		records.CNAME = result.CNAME
	case "MX":
		records.MX = result.MX
	case "NS":
		records.NS = result.NS
	case "PTR":
		records.PTR = result.PTR
	case "SOA":
		records.SOA = make([]models.SOARecord, len(result.SOA))
		for i, soa := range result.SOA {
			records.SOA[i] = models.SOARecord{
				Name:    soa.Name,
				NS:      soa.NS,
				Mbox:    soa.Mbox,
				Serial:  soa.Serial,
				Refresh: soa.Refresh,
				Retry:   soa.Retry,
				Expire:  soa.Expire,
				Minttl:  soa.Minttl,
			}
		}
	case "SRV":
		records.SRV = result.SRV
	case "TXT":
		records.TXT = result.TXT
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported record type"})
		return
	}

	response := models.DNSRecordResponse{
		Host:       result.Host,
		Resolver:   result.Resolver,
		Records:    records,
		TTL:        result.TTL,
		StatusCode: result.StatusCode,
		Timestamp:  result.Timestamp,
	}

	c.JSON(http.StatusOK, gin.H{
		"response": response,
	})
}
