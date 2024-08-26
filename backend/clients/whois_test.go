package clients

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIntegrationWhoisClient_Query(t *testing.T) {
	client := WhoisClient()

	tests := []struct {
		name        string
		query       string
		expectError bool
	}{
		{
			name:        "Valid domain query",
			query:       "example.com",
			expectError: false,
		},
		{
			name:        "Invalid domain query",
			query:       "thisisaninvaliddomain1234567890.com",
			expectError: true,
		},
		{
			name:        "Empty query",
			query:       "",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := client.Query(tt.query)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, result)
			}
		})
	}
}

func TestIntegrationWhoisClient_QueryIP(t *testing.T) {
	client := WhoisClient()

	tests := []struct {
		name        string
		query       string
		expectError bool
	}{
		{
			name:        "Valid IP query",
			query:       "8.8.8.8",
			expectError: false,
		},
		{
			name:        "Invalid IP query",
			query:       "999.999.999.999",
			expectError: true,
		},
		{
			name:        "Empty IP query",
			query:       "",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := client.QueryIP(tt.query)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, result)
			}
		})
	}
}
