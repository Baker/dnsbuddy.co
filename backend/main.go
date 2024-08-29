package main

import (
	"net/http"

	"backend/controllers"
	"backend/utils"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	utils.InitializeLogger()

	router.GET("/", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.POST("/whois/", controllers.WhoisLookup)
	router.POST("/whois/domain/available/", controllers.DomainAvailable)

	router.POST("/dns/", controllers.DNSLookup)
	router.POST("/dns/all/", controllers.DNSLookupAllProviders)
	router.POST("/dns/overview/", controllers.DNSLookupOverview)

	router.POST("/email/spf/", controllers.SpfLookup)

	router.POST("/subfinder/", controllers.SubfinderLookup)

	router.Run(":8080")
}
