package models

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

type DNSProvider string

const (
	Cloudflare DNSProvider = "cloudflare"
	Google     DNSProvider = "google"
	Alibaba    DNSProvider = "alibaba"
	Quad9      DNSProvider = "quad9"
)

type RecordType string

const (
	A     RecordType = "A"
	AAAA  RecordType = "AAAA"
	NS    RecordType = "NS"
	MX    RecordType = "MX"
	SOA   RecordType = "SOA"
	SRV   RecordType = "SRV"
	PTR   RecordType = "PTR"
	TXT   RecordType = "TXT"
	CNAME RecordType = "CNAME"
)

type DNSRecordRequest struct {
	Query    string      `json:"query"`
	Type     RecordType  `json:"type"`
	Provider DNSProvider `json:"provider"`
}

func (r RecordType) IsValid() bool {
	switch RecordType(strings.ToUpper(string(r))) {
	case A, AAAA, NS, MX, SOA, SRV, PTR, TXT, CNAME:
		return true
	default:
		return false
	}
}

func (d DNSProvider) IsValid() bool {
	switch DNSProvider(strings.ToLower(string(d))) {
	case Cloudflare, Google, Alibaba, Quad9:
		return true
	default:
		return false
	}
}

// UnmarshalJSON implements the json.Unmarshaler interface
func (r *RecordType) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	*r = RecordType(strings.ToUpper(s))
	if !r.IsValid() {
		return fmt.Errorf("invalid RecordType: %s", s)
	}
	return nil
}

// MarshalJSON implements the json.Marshaler interface
func (r RecordType) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(r))
}

// UnmarshalJSON implements the json.Unmarshaler interface
func (r *DNSProvider) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	*r = DNSProvider(strings.ToUpper(s))
	if !r.IsValid() {
		return fmt.Errorf("invalid DNSProvider: %s", s)
	}
	return nil
}

// MarshalJSON implements the json.Marshaler interface
func (r DNSProvider) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(r))
}

type SOARecord struct {
	Name    string `json:"name,omitempty"`
	NS      string `json:"ns,omitempty"`
	Mbox    string `json:"mailbox,omitempty"`
	Serial  uint32 `json:"serial,omitempty"`
	Refresh uint32 `json:"refresh,omitempty"`
	Retry   uint32 `json:"retry,omitempty"`
	Expire  uint32 `json:"expire,omitempty"`
	Minttl  uint32 `json:"minttl,omitempty"`
}


type DNSRecords struct {
	A     []string    `json:"a,omitempty"`
	AAAA  []string    `json:"aaaa,omitempty"`
	CNAME []string    `json:"cname,omitempty"`
	MX    []string    `json:"mx,omitempty"`
	NS    []string    `json:"ns,omitempty"`
	PTR   []string    `json:"ptr,omitempty"`
	SOA   []SOARecord `json:"soa,omitempty"`
	SRV   []string    `json:"srv,omitempty"`
	TXT   []string    `json:"txt,omitempty"`
}

type DNSRecordResponse struct {
	Host       string     `json:"host"`
	TTL        uint32     `json:"ttl"`
	Resolver   []string   `json:"resolver"`
	Records    DNSRecords `json:"records,omitempty"`
	StatusCode string     `json:"status_code"`
	Timestamp  time.Time  `json:"timestamp"`
}
