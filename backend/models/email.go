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

type DmarcRecord struct {
	Version         string   `json:"version"`
	Policy          string   `json:"policy"`
	SubdomainPolicy string   `json:"subdomain_policy"`
	Adkim           string   `json:"adkim"`
	Aspf            string   `json:"aspf"`
	Percentage      string   `json:"percentage"`
	RUA             []string `json:"rua"`
	RI              int      `json:"ri"`
	RUF             []string `json:"ruf"`
	FO              int      `json:"fo"`
	RF              string   `json:"rf"`
}
