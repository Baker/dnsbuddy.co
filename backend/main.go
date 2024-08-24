package main

import (
	"net/http"

	"backend/clients"
	"backend/controllers"
	"backend/utils"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	utils.InitializeLogger()

	whoisClient := clients.NewWhoisClient()
	whoisController := controllers.NewWhois(whoisClient)

	router.GET("/", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.POST("/whois", whoisController.WhoisLookup)
	router.POST("/whois/domain/available", whoisController.WhoIsDomainAvailable)

	router.POST("/dns/", controllers.DNSLookup)
	router.POST("/asn/", controllers.ASNLookup)

	router.Run(":8080")
}
