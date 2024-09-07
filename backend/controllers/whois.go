package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"

	"backend/models"
	"backend/utils"
	"context"
	"github.com/jamesog/iptoasn"
	"github.com/shlin168/go-whois/whois"
	"go.uber.org/zap"
)

// WhoisLookup godoc
// @Summary Perform a WHOIS lookup
// @Description Perform a WHOIS lookup for a domain, IP address, or ASN
// @Tags whois
// @Accept json
// @Produce json
// @Param request body models.WhoisLookup true "WHOIS lookup request"
// @Success 200 {object} interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /whois [post]
func WhoisLookup(c *gin.Context) {
	client, err := whois.NewClient()
	if err != nil {
		utils.Logger.Error("Failed to create WHOIS client", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx := context.Background()

	var body models.WhoisLookup
	if err := c.BindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var result interface{}
	var error error

	switch body.Type {
	case models.Domain:
		result, error = client.Query(ctx, body.Query)
	case models.IP:
		result, error = client.QueryIP(ctx, body.Query)
	case models.ASN:
		// asnclient, err := asnmap.NewClient()
		// if err != nil {
		// 	utils.Logger.Error("Failed to create ASNMAP client", zap.Error(err))
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		// 	return
		// }
		// responses, err := asnclient.GetData(body.Query)
		// if err != nil {
		// 	utils.Logger.Error("Failed to get ASN data", zap.Error(err))
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		// 	return
		// }
		// result, err = asnmap.MapToResults(responses)
		result, error = iptoasn.LookupASN(body.Query)
	default:
		utils.Logger.Error("Invalid lookup type")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lookup type"})
		return
	}

	if error != nil {
		utils.Logger.Error("Failed to query WHOIS", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func DomainAvailable(c *gin.Context) {
	client, err := whois.NewClient()
	if err != nil {
		utils.Logger.Error("Failed to create WHOIS client", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx := context.Background()

	var body models.WhoisLookup
	if body.Type == "" {
		body.Type = models.Domain // Set default type to Domain
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = client.Query(ctx, body.Query)
	if err != nil {
		if strings.Contains(err.Error(), "domain/ip not found") {
			utils.Logger.Info("Domain is available", zap.String("domain", body.Query))
			c.JSON(http.StatusOK, gin.H{"available": true})
			return
		}
		utils.Logger.Error("Failed to query WHOIS", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"available": false})
}
