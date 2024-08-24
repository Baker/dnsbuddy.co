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
	switch rt {
	case models.A:
		return dns.TypeA, nil
	case models.AAAA:
		return dns.TypeAAAA, nil
	case models.CNAME:
		return dns.TypeCNAME, nil
	case models.MX:
		return dns.TypeMX, nil
	case models.NS:
		return dns.TypeNS, nil
	case models.PTR:
		return dns.TypePTR, nil
	case models.SOA:
		return dns.TypeSOA, nil
	case models.SRV:
		return dns.TypeSRV, nil
	case models.TXT:
		return dns.TypeTXT, nil
	default:
		return dns.TypeNone, fmt.Errorf("unsupported record type: %v", rt)
	}
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
		records.SOA = make([]models.SOARecord, len(result.SOA))
		for i, soa := range result.SOA {
			records.SOA[i] = models.SOARecord{
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
	switch provider {
	case models.Cloudflare:
		// Source: https://one.one.one.one/dns/
		return []string{"1.1.1.1", "1.0.0.1"}, nil
	case models.Google:
		// Source: https://developers.google.com/speed/public-dns
		return []string{"8.8.8.8", "8.8.4.4"}, nil
	case models.Alibaba:
		// Source: https://www.alibabacloud.com/help/en/dns/what-is-alibaba-cloud-public-dns
		return []string{"223.5.5.5", "223.6.6.6"}, nil
	case models.Quad9:
		// Source: https://www.quad9.net/
		return []string{"9.9.9.9", "149.112.112.112"}, nil
	case models.DNSFilter:
		// Source: https://www.dnsfilter.com/
		return []string{"103.247.36.36", "103.247.37.37"}, nil
	case models.OpenDNS:
		// Source: https://www.opendns.com/
		return []string{"208.67.222.222", "208.67.220.220"}, nil
	case models.DynDNS:
		// Source: https://help.dyn.com/internet-guide-setup/
		return []string{"216.146.35.35", "216.146.36.36"}, nil
	case models.CenturyLink:
		// Source: https://www.centurylink.com/home/help/internet/dns.html
		return []string{"205.171.3.65", "205.171.2.65"}, nil
	case models.Yandex:
		// Source: https://dns.yandex.com/
		return []string{"77.88.8.8", "77.88.8.1"}, nil
	default:
		return nil, fmt.Errorf("unsupported DNS provider: %s", provider)
	}
}
