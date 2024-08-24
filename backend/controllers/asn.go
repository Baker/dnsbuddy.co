package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ASNLookup(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, World!",
	})
}
