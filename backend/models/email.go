package models

import (
	"time"
)

type SpfRecord struct {
	Qualifier string   `json:"qualifier"`
	IPv4      []string `json:"ipv4"`
	IPv6      []string `json:"ipv6"`
	MX        []string `json:"mx"`
	PTR       []string `json:"ptr"`
	A         []string `json:"a"`
	Include   []string `json:"include"`
	Exists    []string `json:"exists"`
}

type ExtendedSpf struct {
	Qualifier string                 `json:"qualifier"`
	IPv4      []string               `json:"ipv4"`
	IPv6      []string               `json:"ipv6"`
	MX        []string               `json:"mx"`
	PTR       []string               `json:"ptr"`
	A         []string               `json:"a"`
	Include   map[string]ExtendedSpf `json:"include"`
	Exists    []string               `json:"exists"`
}

type ExtendedSpfRecord struct {
	Qualifier string                 `json:"qualifier"`
	IPv4      []string               `json:"ipv4"`
	IPv6      []string               `json:"ipv6"`
	MX        []string               `json:"mx"`
	PTR       []string               `json:"ptr"`
	A         []string               `json:"a"`
	Include   map[string]ExtendedSpf `json:"include"`
	Exists    []string               `json:"exists"`
}

type ExtendedSpfRecordResponse struct {
	Lookups   int               `json:"lookups"`
	SPF       string            `json:"spf"`
	Time      time.Duration     `json:"time"`
	Breakdown ExtendedSpfRecord `json:"breakdown"`
}
