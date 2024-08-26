package models

import (
	"encoding/json"
	"time"

	"backend/utils/validators"
)

type DNSProvider string
type RecordType string

const (
	// DNS Providers
	Cloudflare  DNSProvider = "CLOUDFLARE"
	Google      DNSProvider = "GOOGLE"
	Alibaba     DNSProvider = "ALIBABA"
	Quad9       DNSProvider = "QUAD9"
	DNSFilter   DNSProvider = "DNSFILTER"
	OpenDNS     DNSProvider = "OPENDNS"
	DynDNS      DNSProvider = "DYNDNS"
	CenturyLink DNSProvider = "CENTURYLINK"
	Yandex      DNSProvider = "YANDEX"

	// Record Types
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

var (
	AllDNSProviders = []DNSProvider{
		Cloudflare, Google, Alibaba, Quad9, DNSFilter,
		OpenDNS, DynDNS, CenturyLink, Yandex,
	}

	AllRecordTypes = []RecordType{
		A, AAAA, NS, MX, SOA, SRV, PTR, TXT, CNAME,
	}

	validDNSProviders = make(map[DNSProvider]bool)
	validRecordTypes  = make(map[RecordType]bool)
)

func init() {
	for _, p := range AllDNSProviders {
		validDNSProviders[p] = true
	}
	for _, r := range AllRecordTypes {
		validRecordTypes[r] = true
	}
}

func (d DNSProvider) IsValid() bool {
	return validators.IsValid(d, validDNSProviders)
}

func (r RecordType) IsValid() bool {
	return validators.IsValid(r, validRecordTypes)
}

func (r *RecordType) UnmarshalJSON(data []byte) error {
	return validators.UnmarshalJSON(data, r, validRecordTypes, "RecordType")
}

func (d *DNSProvider) UnmarshalJSON(data []byte) error {
	return validators.UnmarshalJSON(data, d, validDNSProviders, "DNSProvider")
}

func (r RecordType) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(r))
}

func (r DNSProvider) MarshalJSON() ([]byte, error) {
	return json.Marshal(string(r))
}

type DNSRecordRequest struct {
	Query    string      `json:"query"`
	Type     RecordType  `json:"type"`
	Provider DNSProvider `json:"provider"`
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

type MXRecord struct {
	Host string `json:"host,omitempty"`
	Pref uint16 `json:"pref,omitempty"`
}

type DNSRecords struct {
	A     []string    `json:"a,omitempty"`
	AAAA  []string    `json:"aaaa,omitempty"`
	CNAME []string    `json:"cname,omitempty"`
	MX    []MXRecord  `json:"mx,omitempty"`
	NS    []string    `json:"ns,omitempty"`
	PTR   []string    `json:"ptr,omitempty"`
	SOA   []SOARecord `json:"soa,omitempty"`
	SRV   []string    `json:"srv,omitempty"`
	TXT   []string    `json:"txt,omitempty"`
}

type DNSRecordResponse struct {
	Host       string        `json:"host"`
	Type       RecordType    `json:"type,omitempty"`
	TTL        uint32        `json:"ttl"`
	Resolver   []string      `json:"resolver"`
	Records    DNSRecords    `json:"records"`
	StatusCode string        `json:"status_code"`
	Timestamp  time.Time     `json:"timestamp"`
	TotalTime  time.Duration `json:"total_time"`
}

type DNSRecordRequestAllProviders struct {
	Query string     `json:"query"`
	Type  RecordType `json:"type"`
}

type DNSRecordProviderPairing struct {
	Provider   DNSProvider `json:"provider"`
	Record     DNSRecords  `json:"record"`
	StatusCode string      `json:"status_code"`
}

type DNSRecordResponseAllProviders struct {
	Host      string                     `json:"host"`
	Type      RecordType                 `json:"type"`
	Records   []DNSRecordProviderPairing `json:"records"`
	Timestamp time.Time                  `json:"timestamp"`
	TotalTime time.Duration              `json:"total_time"`
}

type DNSRequest struct {
	Query string `json:"query"`
}
