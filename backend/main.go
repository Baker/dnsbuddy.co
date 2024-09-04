package main

import (
	"backend/controllers"
	"backend/utils"
	sentrygin "github.com/getsentry/sentry-go/gin"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func init() {
	utils.InitializeLogger()
	utils.InitializeSentry()
	utils.LoadEnv()
}

func main() {
	router := gin.Default()

	router.Use(ginzap.Ginzap(utils.Logger, time.RFC3339, true))
	router.Use(ginzap.RecoveryWithZap(utils.Logger, true))
	router.Use(sentrygin.New(sentrygin.Options{}))

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

	router.POST("/email/spf/", controllers.BreakDownSpf)

	router.POST("/subfinder/", controllers.SubfinderLookup)

	router.Run(":8080")
}
