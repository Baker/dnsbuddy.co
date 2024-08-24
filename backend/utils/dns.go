package utils

import (
	"fmt"

	"github.com/miekg/dns"

	"backend/models"
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
