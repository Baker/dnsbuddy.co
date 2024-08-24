package clients

import (
	"context"
	"fmt"

	"backend/utils"
	"github.com/shlin168/go-whois/whois"
	"go.uber.org/zap"
)

type WhoisClientInterface interface {
	Query(query string) (interface{}, error)
	QueryIP(query string) (interface{}, error)
}

type WhoisClient struct {
	client *whois.Client
	ctx    context.Context
}

func NewWhoisClient() *WhoisClient {
	client, err := whois.NewClient()
	if err != nil {
		utils.Logger.Error("Failed to create WHOIS client", zap.Error(err))
	}
	return &WhoisClient{
		client: client,
		ctx:    context.Background(),
	}
}

func (w *WhoisClient) Query(query string) (interface{}, error) {
	if query == "" {
		utils.Logger.Error("empty domain query")
		return nil, fmt.Errorf("empty domain query")
	}
	return w.client.Query(w.ctx, query)
}

func (w *WhoisClient) QueryIP(query string) (interface{}, error) {
	if query == "" {
		utils.Logger.Error("empty IP query")
		return nil, fmt.Errorf("empty IP query")
	}
	return w.client.QueryIP(w.ctx, query)
}
