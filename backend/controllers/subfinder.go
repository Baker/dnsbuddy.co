package controllers

import (
	"github.com/gin-gonic/gin"
	"context"
	"backend/utils"
	"backend/models"
	"github.com/projectdiscovery/subfinder/v2/pkg/runner"
	"go.uber.org/zap"
	"bytes"
	"io"
	"net/http"
	"strings"
)

func SubfinderLookup(c *gin.Context) {
	ctx := context.Background()
	subfinderOpts := &runner.Options{
		Threads:            30, // Thread controls the number of threads to use for active enumerations
		Timeout:            5, // Timeout is the seconds to wait for sources to respond
		MaxEnumerationTime: 10, //sources will be queried for max this time (in seconds)
	}

	var body models.SubfinderLookup
	if err := c.BindJSON(&body); err != nil {
		utils.Logger.Error("Failed to bind JSON", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subfinder, err := runner.NewRunner(subfinderOpts)
	if err != nil {
		utils.Logger.Error("Failed to create subfinder", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	output := &bytes.Buffer{}
	if err = subfinder.EnumerateSingleDomainWithCtx(ctx, body.Domain, []io.Writer{output}); err != nil {
		utils.Logger.Error("failed to enumerate single domain", zap.Error(err))
	}

	subdomains := strings.Split(strings.TrimSpace(output.String()), "\n")
	subfinderResponse := models.SubfinderResponse{
		Domain:     body.Domain,
		Subdomains: subdomains,
		Count:      len(subdomains),
	}
	c.JSON(http.StatusOK, gin.H{"data": subfinderResponse})
}
