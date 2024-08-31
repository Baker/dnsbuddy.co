package models

type SubfinderLookup struct {
	Domain string `json:"query"`
}

type SubfinderResponse struct {
	Domain     string   `json:"domain"`
	Subdomains []string `json:"subdomains"`
	Count      int      `json:"count"`
}
