package models

import (
	"encoding/json"

	"backend/utils/validators"
)

type WhoisLookupType string

const (
	Domain WhoisLookupType = "DOMAIN"
	IP     WhoisLookupType = "IP"
	ASN    WhoisLookupType = "ASN"
)

type WhoisLookup struct {
	Query string          `json:"query" binding:"required"`
	Type  WhoisLookupType `json:"type" binding:"required"`
}

var (
	AllWhoisLookupTypes = []WhoisLookupType{Domain, IP, ASN}

	validWhoisLookupTypes = make(map[WhoisLookupType]bool)
)

func init() {
	for _, t := range AllWhoisLookupTypes {
		validWhoisLookupTypes[t] = true
	}
}

func (t WhoisLookupType) IsValid() bool {
	return validators.IsValid(t, validWhoisLookupTypes)
}

func (t *WhoisLookupType) UnmarshalJSON(data []byte) error {
	return validators.UnmarshalJSON(data, t, validWhoisLookupTypes, "WhoisLookupType")
}

func (t WhoisLookupType) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(t))
}
