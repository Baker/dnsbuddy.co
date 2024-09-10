package models

import (
	"time"

	"backend/utils/validators"
)

type SpfRecord struct {
	Qualifier   string   `json:"qualifier"`
	IPv4        []string `json:"ipv4,omitempty"`
	IPv6        []string `json:"ipv6,omitempty"`
	MX          []string `json:"mx,omitempty"`
	PTR         []string `json:"ptr,omitempty"`
	A           []string `json:"a,omitempty"`
	Include     []string `json:"include,omitempty"`
	Exists      []string `json:"exists,omitempty"`
	Redirect    []string `json:"redirect,omitempty"`
	Explanation []string `json:"explanation,omitempty"`
}

type ExtendedSpf struct {
	Qualifier   string                 `json:"qualifier"`
	IPv4        []string               `json:"ipv4,omitempty"`
	IPv6        []string               `json:"ipv6,omitempty"`
	MX          []string               `json:"mx,omitempty"`
	PTR         []string               `json:"ptr,omitempty"`
	A           []string               `json:"a,omitempty"`
	Include     map[string]ExtendedSpf `json:"include,omitempty"`
	Exists      []string               `json:"exists,omitempty"`
	Redirect    map[string]ExtendedSpf `json:"redirect,omitempty"`
	Explanation map[string]string      `json:"explanation,omitempty"`
}

type ExtendedSpfRecord struct {
	Qualifier   string                 `json:"qualifier"`
	IPv4        []string               `json:"ipv4,omitempty"`
	IPv6        []string               `json:"ipv6,omitempty"`
	MX          []string               `json:"mx,omitempty"`
	PTR         []string               `json:"ptr,omitempty"`
	A           []string               `json:"a,omitempty"`
	Include     map[string]ExtendedSpf `json:"include,omitempty"`
	Exists      []string               `json:"exists,omitempty"`
	Redirect    map[string]ExtendedSpf `json:"redirect,omitempty"`
	Explanation map[string]string      `json:"explanation,omitempty"`
}

type ExtendedSpfRecordResponse struct {
	Lookups   int               `json:"lookups"`
	SPF       string            `json:"spf"`
	Timestamp time.Time         `json:"timestamp"`
	TotalTime int               `json:"total_time"`
	Breakdown ExtendedSpfRecord `json:"breakdown"`
}

type Policy string
type Mode string
type FailureReporting string

const (
	None          Policy           = "none"
	Quarantine    Policy           = "quarantine"
	Reject        Policy           = "reject"
	Relaxed       Mode             = "r"
	Strict        Mode             = "s"
	All           FailureReporting = "0"
	Any           FailureReporting = "1"
	SPF           FailureReporting = "d"
	DomainFailure FailureReporting = "s"
)

var (
	AllPolicies         = []Policy{None, Quarantine, Reject}
	AllModes            = []Mode{Relaxed, Strict}
	AllFailureReporting = []FailureReporting{All, Any, SPF, DomainFailure}

	validPolicies         = make(map[Policy]bool)
	validModes            = make(map[Mode]bool)
	validFailureReporting = make(map[FailureReporting]bool)
)

func init() {
	for _, p := range AllPolicies {
		validPolicies[p] = true
	}
	for _, m := range AllModes {
		validModes[m] = true
	}
	for _, f := range AllFailureReporting {
		validFailureReporting[f] = true
	}
}

func (p Policy) IsValid() bool {
	return validators.IsValid(p, validPolicies)
}

func (m Mode) IsValid() bool {
	return validators.IsValid(m, validModes)
}

func (f FailureReporting) IsValid() bool {
	return validators.IsValid(f, validFailureReporting)
}

type DmarcRecord struct {
	Version         string           `json:"version"`
	Policy          Policy           `json:"policy"`
	SubdomainPolicy Policy           `json:"subdomain_policy"`
	Adkim           Mode             `json:"adkim"`
	Aspf            Mode             `json:"aspf"`
	Percentage      int              `json:"percentage"`
	RUA             []string         `json:"rua"`
	RI              int              `json:"ri"`
	RUF             []string         `json:"ruf"`
	FO              FailureReporting `json:"fo"`
	RF              string           `json:"rf"`
}

func NewDmarcRecord() DmarcRecord {
	return DmarcRecord{
		Version:    "DMARC1",
		Adkim:      "r",
		Aspf:       "r",
		Percentage: 100,
		RI:         86400,
		FO:         FailureReporting(All),
		RF:         "afrf",
	}
}

type DmarcExternalReporting struct {
	Domain string `json:"domain"`
	Record string `json:"record"`
	Valid  bool   `json:"valid"`
}

type DmarcRecordResponse struct {
	Query     string                   `json:"query"`
	Record    DmarcRecord              `json:"record,omitempty"`
	External  []DmarcExternalReporting `json:"external,omitempty"`
	Raw       string                   `json:"raw"`
	Timestamp time.Time                `json:"timestamp"`
	TotalTime int                      `json:"total_time"`
}
