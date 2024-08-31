package utils

import (
	"regexp"
	"strings"

	"backend/models"
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
			// Handle redirect modifier if needed
		} else if mod[1] == "exp" {
			// Handle explanation modifier if needed
		}
	}
	return models.SpfRecord{
		Qualifier: terms,
		Include:   record.Include,
		MX:        record.MX,
		IPv4:      record.IPv4,
		IPv6:      record.IPv6,
		PTR:       record.PTR,
	}
}
