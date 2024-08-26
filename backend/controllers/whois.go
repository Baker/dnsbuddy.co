package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/jamesog/iptoasn"
	"net/http"
	"strings"

	"backend/clients"
	"backend/models"
	"backend/utils"
	"go.uber.org/zap"
)

type Whois struct {
	client clients.WhoisClientInterface
}

func WhoisController(client clients.WhoisClientInterface) *Whois {
	return &Whois{client: client}
}

func (w *Whois) WhoisLookup(c *gin.Context) {
	var body models.WhoisLookup
	if err := c.BindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var result interface{}
	var err error

	switch body.Type {
	case models.Domain:
		result, err = w.client.Query(body.Query)
	case models.IP:
		result, err = w.client.QueryIP(body.Query)
	case models.ASN:
		result, err = iptoasn.LookupASN(body.Query)
	default:
		utils.Logger.Error("Invalid lookup type")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lookup type"})
		return
	}

	if err != nil {
		utils.Logger.Error("Failed to query WHOIS", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (w *Whois) WhoIsDomainAvailable(c *gin.Context) {
	var body models.WhoisLookup
	if body.Type == "" {
		body.Type = models.Domain // Set default type to Domain
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := w.client.Query(body.Query)
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
