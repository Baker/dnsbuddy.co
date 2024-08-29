package models

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
