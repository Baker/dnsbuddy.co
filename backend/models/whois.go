package models

import (
	"encoding/json"
	"fmt"
	"strings"
)

// WhoisLookupType represents the type of WHOIS lookup
type WhoisLookupType string

const (
	Domain WhoisLookupType = "DOMAIN"
	IP     WhoisLookupType = "IP"
	ASN    WhoisLookupType = "ASN"
)

// WhoisLookup represents a WHOIS lookup request
type WhoisLookup struct {
	Query string          `json:"query" binding:"required"`
	Type  WhoisLookupType `json:"type" binding:"required"`
}

// IsValid checks if the WhoisLookupType is valid
func (t WhoisLookupType) IsValid() bool {
	switch WhoisLookupType(strings.ToUpper(string(t))) {
	case Domain, IP, ASN:
		return true
	}
	return false
}

// UnmarshalJSON implements the json.Unmarshaler interface
func (t *WhoisLookupType) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	*t = WhoisLookupType(strings.ToUpper(s))
	if !t.IsValid() {
		return fmt.Errorf("invalid WhoisLookupType: %s", s)
	}
	return nil
}

// MarshalJSON implements the json.Marshaler interface
func (t WhoisLookupType) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(t))
}
