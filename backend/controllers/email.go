package controllers

import (
	"backend/models"
	"backend/utils"
	"github.com/gin-gonic/gin"
	"github.com/projectdiscovery/dnsx/libs/dnsx"
	"go.uber.org/zap"
	"net/http"
	"strings"
	"time"
)

func SpfLookup(c *gin.Context) {
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
	dnsxOptions.MaxRetries = 1
	dnsxOptions.QuestionTypes = questionTypes
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

	var spfs string
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
	parsedSPF := utils.ParseSPF(spfs)
	c.JSON(http.StatusOK, gin.H{"spf": spfs, "parsed": parsedSPF, "time": time.Since(startTime)})
}
