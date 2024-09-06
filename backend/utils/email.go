package utils

import (
	"backend/models"
	"regexp"
	"strconv"
	"strings"
)

// Result of SPF check
type Result string

// SPF results
const (
	Neutral   = Result("NEUTRAL")
	Pass      = Result("PASS")
	Fail      = Result("FAIL")
	Softfail  = Result("SOFTFAIL")
	None      = Result("NONE")
	Permerror = Result("PERMERROR")
	Temperror = Result("TEMPERROR")
)

type modifier struct {
	name  string
	value string
}

type directive struct {
	qualifier string
	mechanism string
	param     string
}

var allMechanismRegex = regexp.MustCompile(`([+-?~\s])all$`)
var otherMechanismRegex = regexp.MustCompile(`([+\-~?])?(include|mx|ip4|ip6|a|ptr|exists):(\S+)`)
var modifierRegex = regexp.MustCompile(`(redirect|exp)=(\S+)`)

func allQualifier(q string) Result {
	switch q {
	case "~":
		return Softfail
	case "-":
		return Fail
	case "?":
		return Neutral
	default:
		return Pass
	}
}

func BreakDownSpf(spf string) models.SpfRecord {
	spf = strings.TrimSpace(strings.TrimPrefix(spf, "v=spf1"))

	var terms string
	match := allMechanismRegex.FindStringSubmatch(spf)
	if match != nil {
		qualifier := match[1]
		result := allQualifier(qualifier)
		terms = string(result)
	}
	mechanisms := otherMechanismRegex.FindAllStringSubmatch(spf, -1)
	modifiers := modifierRegex.FindAllStringSubmatch(spf, -1)

	var record models.SpfRecord

	mechanismMap := map[string]*[]string{
		"include": &record.Include,
		"mx":      &record.MX,
		"ip4":     &record.IPv4,
		"ip6":     &record.IPv6,
		"ptr":     &record.PTR,
		"a":       &record.A,
		"exists":  &record.Exists,
	}

	for _, m := range mechanisms {
		mechanism := m[2]
		value := m[3]
		if slice, ok := mechanismMap[mechanism]; ok {
			*slice = append(*slice, value)
		}
	}

	for _, mod := range modifiers {
		if mod[1] == "redirect" {
			record.Redirect = append(record.Redirect, mod[2])
		} else if mod[1] == "exp" {
			record.Explanation = append(record.Explanation, mod[2])
		}
	}
	return models.SpfRecord{
		Qualifier:   terms,
		Include:     record.Include,
		MX:          record.MX,
		IPv4:        record.IPv4,
		IPv6:        record.IPv6,
		PTR:         record.PTR,
		Redirect:    record.Redirect,
		Explanation: record.Explanation,
	}
}

// regexr.com/85jvr
var dmarcRegex = regexp.MustCompile(`(p|sp|rua|ruf|adkim|aspf|pct|ri|ro|rf|v)=(\S+)`)

func BreakDownDmarc(dmarc string) models.DmarcRecord {
	var record models.DmarcRecord = models.NewDmarcRecord()

	matches := dmarcRegex.FindAllStringSubmatch(dmarc, -1)

	for _, match := range matches {
		key := match[1]
		value := strings.TrimSuffix(match[2], ";")
		switch key {
		case "v":
			record.Version = value
		case "p":
			record.Policy = models.Policy(value)
		case "sp":
			record.SubdomainPolicy = models.Policy(value)
		case "adkim":
			record.Adkim = models.Mode(value)
		case "aspf":
			record.Aspf = models.Mode(value)
		case "pct":
			if pct, err := strconv.Atoi(value); err == nil {
				record.Percentage = pct
			}
		case "rua":
			Addresses := strings.Split(value, ",")
			for _, address := range Addresses {
				record.RUA = append(record.RUA, strings.TrimSpace(address))
			}
		case "ruf":
			Addresses := strings.Split(value, ",")
			for _, address := range Addresses {
				record.RUF = append(record.RUF, strings.TrimSpace(address))
			}
		case "ri":
			if ri, err := strconv.Atoi(value); err == nil {
				record.RI = ri
			}
		case "fo":
			record.FO = models.FailureReporting(value)
		case "rf":
			record.RF = value
		}
	}

	if record.SubdomainPolicy == "" {
		record.SubdomainPolicy = record.Policy
	}

	return record
}
