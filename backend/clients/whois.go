package clients

import (
	"context"
	"errors"

	"backend/utils"
	"github.com/shlin168/go-whois/whois"
	"go.uber.org/zap"
)

type WhoisClientInterface interface {
	Query(query string) (interface{}, error)
	QueryIP(query string) (interface{}, error)
}

type WhoisClientStruct struct {
	client *whois.Client
	ctx    context.Context
}

func WhoisClient() *WhoisClientStruct {
	client, err := whois.NewClient()
	if err != nil {
		utils.Logger.Error("Failed to create WHOIS client", zap.Error(err))
	}
	return &WhoisClientStruct{
		client: client,
		ctx:    context.Background(),
	}
}

func (c *WhoisClientStruct) Query(query string) (interface{}, error) {
	if query == "" {
		return nil, errors.New("empty query")
	}
	return c.client.Query(c.ctx, query)
}

func (c *WhoisClientStruct) QueryIP(query string) (interface{}, error) {
	if query == "" {
		return nil, errors.New("empty IP query")
	}
	return c.client.QueryIP(c.ctx, query)
}
