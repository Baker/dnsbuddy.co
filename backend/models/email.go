package models

import (
	"time"
)

type SpfRecord struct {
	Qualifier   string   `json:"qualifier"`
	IPv4        []string `json:"ipv4"`
	IPv6        []string `json:"ipv6"`
	MX          []string `json:"mx"`
	PTR         []string `json:"ptr"`
	A           []string `json:"a"`
	Include     []string `json:"include"`
	Exists      []string `json:"exists"`
	Redirect    []string `json:"redirect"`
	Explanation []string `json:"explanation"`
}

type ExtendedSpf struct {
	Qualifier   string                 `json:"qualifier"`
	IPv4        []string               `json:"ipv4"`
	IPv6        []string               `json:"ipv6"`
	MX          []string               `json:"mx"`
	PTR         []string               `json:"ptr"`
	A           []string               `json:"a"`
	Include     map[string]ExtendedSpf `json:"include"`
	Exists      []string               `json:"exists"`
	Redirect    map[string]ExtendedSpf `json:"redirect"`
	Explanation map[string]string      `json:"explanation"`
}

type ExtendedSpfRecord struct {
	Qualifier   string                 `json:"qualifier"`
	IPv4        []string               `json:"ipv4"`
	IPv6        []string               `json:"ipv6"`
	MX          []string               `json:"mx"`
	PTR         []string               `json:"ptr"`
	A           []string               `json:"a"`
	Include     map[string]ExtendedSpf `json:"include"`
	Exists      []string               `json:"exists"`
	Redirect    map[string]ExtendedSpf `json:"redirect"`
	Explanation map[string]string      `json:"explanation"`
}

type ExtendedSpfRecordResponse struct {
	Lookups   int               `json:"lookups"`
	SPF       string            `json:"spf"`
	Time      time.Duration     `json:"time"`
	Breakdown ExtendedSpfRecord `json:"breakdown"`
}

type Policy string

const (
	None       Policy = "none"
	Quarantine Policy = "quarantine"
	Reject     Policy = "reject"
)

type Mode string

const (
	Relaxed Mode = "r"
	Strict  Mode = "s"
)

type FailureReporting string

const (
	All           Fai = "0"
	Any           Fai = "1"
	SPF           Fai = "d"
	DomainFailure Fai = "s"
)

type DmarcRecord struct {
	Version         string   `json:"version"`
	Policy          Policy   `json:"policy"`
	SubdomainPolicy Policy   `json:"subdomain_policy"`
	Adkim           Mode     `json:"adkim"`
	Aspf            Mode     `json:"aspf"`
	Percentage      int      `json:"percentage"`
	RUA             []string `json:"rua"`
	RI              int      `json:"ri"`
	RUF             []string `json:"ruf"`
	FO              Fai      `json:"fo"`
	RF              string   `json:"rf"`
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
	Query     string      `json:"query"`
	Record    DmarcRecord `json:"record"`
	External  []DmarcExternalReporting
	Raw       string        `json:"raw"`
	Time      time.Duration `json:"time"`
	TotalTime time.Duration `json:"total_time"`
}
