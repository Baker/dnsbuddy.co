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
