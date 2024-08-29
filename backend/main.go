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

	whoisClient := clients.WhoisClient()
	whoisController := controllers.WhoisController(whoisClient)

	router.GET("/", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.POST("/whois/", whoisController.WhoisLookup)
	router.POST("/whois/domain/available/", whoisController.WhoIsDomainAvailable)

	router.POST("/dns/", controllers.DNSLookup)
	router.POST("/dns/all/", controllers.DNSLookupAllProviders)
	router.POST("/dns/overview/", controllers.DNSLookupOverview)

	router.POST("/email/spf/", controllers.SpfLookup)

	router.Run(":8080")
}
