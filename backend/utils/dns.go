package utils

import (
	"fmt"

	"backend/models"
	"github.com/miekg/dns"
	retryabledns "github.com/projectdiscovery/retryabledns"
)

// StringToRequestType conversion helper
// Source: https://github.com/projectdiscovery/dnsx/blob/main/libs/dnsx/util.go
func RecordTypeToUint16(rt models.RecordType) (uint16, error) {
	recordTypeMap := map[models.RecordType]uint16{
		models.A:     dns.TypeA,
		models.AAAA:  dns.TypeAAAA,
		models.CNAME: dns.TypeCNAME,
		models.MX:    dns.TypeMX,
		models.NS:    dns.TypeNS,
		models.PTR:   dns.TypePTR,
		models.SOA:   dns.TypeSOA,
		models.SRV:   dns.TypeSRV,
		models.TXT:   dns.TypeTXT,
	}

	if dnsType, ok := recordTypeMap[rt]; ok {
		return dnsType, nil
	}

	return dns.TypeNone, fmt.Errorf("unsupported record type: %v", rt)
}

func ParseRecords(result *retryabledns.DNSData, recordType string) (models.DNSRecords, error) {
	records := models.DNSRecords{}

	switch recordType {
	case "A":
		records.A = result.A
	case "AAAA":
		records.AAAA = result.AAAA
	case "CNAME":
		records.CNAME = result.CNAME
	case "MX":
		raw := result.RawResp
		records.MX = make([]models.MXRecord, 0)
		for _, answer := range raw.Answer {
			if mx, ok := answer.(*dns.MX); ok {
				records.MX = append(records.MX, models.MXRecord{
					Host: mx.Mx,
					Pref: mx.Preference,
				})
			}
		}
	case "NS":
		records.NS = result.NS
	case "PTR":
		records.PTR = result.PTR
	case "SOA":
		// Noticed the API at times returns duplicate SOA records, so we're using a map to deduplicate them
		uniqueSOA := make(map[string]models.SOARecord)
		for _, soa := range result.SOA {
			key := fmt.Sprintf("%s-%s-%s", soa.Name, soa.NS, soa.Mbox)
			uniqueSOA[key] = models.SOARecord{
				Name:    soa.Name,
				NS:      soa.NS,
				Mbox:    soa.Mbox,
				Serial:  soa.Serial,
				Refresh: soa.Refresh,
				Retry:   soa.Retry,
				Expire:  soa.Expire,
				Minttl:  soa.Minttl,
			}
		}
		records.SOA = make([]models.SOARecord, 0, len(uniqueSOA))
		for _, record := range uniqueSOA {
			records.SOA = append(records.SOA, record)
		}
	case "SRV":
		records.SRV = result.SRV
	case "TXT":
		records.TXT = result.TXT
	default:
		return records, fmt.Errorf("unsupported record type: %s", recordType)
	}

	return records, nil
}

func FetchDnsProvider(provider models.DNSProvider) ([]string, error) {
	// TODO Expand this to support countries, and fetch them from: https://public-dns.info
	var providers map[models.DNSProvider][]string = map[models.DNSProvider][]string{
		models.Cloudflare:  {"1.1.1.1", "1.0.0.1"},
		models.Google:      {"8.8.8.8", "8.8.4.4"},
		models.Alibaba:     {"223.5.5.5", "223.6.6.6"},
		models.Quad9:       {"9.9.9.9", "149.112.112.112"},
		models.DNSFilter:   {"103.247.36.36", "103.247.37.37"},
		models.OpenDNS:     {"208.67.222.222", "208.67.220.220"},
		models.DynDNS:      {"216.146.35.35", "216.146.36.36"},
		models.CenturyLink: {"205.171.3.65", "205.171.2.65"},
		models.Yandex:      {"77.88.8.8", "77.88.8.1"},
	}

	if ips, ok := providers[provider]; ok {
		return ips, nil
	}

	return nil, fmt.Errorf("unsupported DNS provider: %s", provider)
}
