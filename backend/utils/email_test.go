package utils

import (
	"reflect"
	"testing"

	"backend/models"
)

func TestAllQualifier(t *testing.T) {
	tests := []struct {
		name string
		q    string
		want Result
	}{
		{"Softfail", "~", Softfail},
		{"Fail", "-", Fail},
		{"Neutral", "?", Neutral},
		{"Pass", "+", Pass},
		{"Default", "", Pass},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := allQualifier(tt.q); got != tt.want {
				t.Errorf("allQualifier() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestAllMechanismRegex(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  bool
	}{
		{"All mechanism", " all", true},
		{"Random domain", "test-all.com", false},
		{"All with qualifier", "+all", true},
		{"Negative all", "-all", true},
		{"Softfail all", "~all", true},
		{"Neutral all", "?all", true},
		{"Not all", "notall", false},
		{"Invalid order", "all+", false},
		{"extra characters", "?allb", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := allMechanismRegex.MatchString(tt.input); got != tt.want {
				t.Errorf("allMechanismRegex.MatchString(%q) = %v, want %v", tt.input, got, tt.want)
			}
		})
	}
}

func TestOtherMechanismRegex(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  bool
	}{
		{"Include mechanism", "include:example.com", true},
		{"MX mechanism", "mx:example.com", true},
		{"IP4 mechanism", "ip4:192.0.2.1", true},
		{"IP6 mechanism", "ip6:2001:db8::1", true},
		{"A mechanism", "a:example.com", true},
		{"PTR mechanism", "ptr:example.com", true},
		{"Exists mechanism", "exists:example.com", true},
		{"Mechanism with qualifier", "+include:example.com", true},
		{"Invalid mechanism", "invalid:example.com", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := otherMechanismRegex.MatchString(tt.input); got != tt.want {
				t.Errorf("otherMechanismRegex.MatchString(%q) = %v, want %v", tt.input, got, tt.want)
			}
		})
	}
}

func TestModifierRegex(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  bool
	}{
		{"Redirect modifier", "redirect=example.com", true},
		{"Exp modifier", "exp=example.com", true},
		{"Invalid modifier", "invalid=example.com", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := modifierRegex.MatchString(tt.input); got != tt.want {
				t.Errorf("modifierRegex.MatchString(%q) = %v, want %v", tt.input, got, tt.want)
			}
		})
	}
}

func TestBreakDownSpf(t *testing.T) {
	tests := []struct {
		name string
		spf  string
		want models.SpfRecord
	}{
		{
			name: "Basic SPF record",
			spf:  "v=spf1 include:_spf.google.com ip4:192.168.0.1 -all",
			want: models.SpfRecord{
				Qualifier: "FAIL",
				Include:   []string{"_spf.google.com"},
				IPv4:      []string{"192.168.0.1"},
			},
		},
		{
			name: "SPF record with modifiers",
			spf:  "v=spf1 redirect=_spf.example.com exp=explain.example.com",
			want: models.SpfRecord{
				Redirect:    []string{"_spf.example.com"},
				Explanation: []string{"explain.example.com"},
			},
		},
		{
			name: "SPF record with different qualifiers",
			spf:  "v=spf1 +ip4:192.0.2.1 ?ip4:192.0.2.2 ~ip4:192.0.2.3 -ip4:192.0.2.4 ~all",
			want: models.SpfRecord{
				Qualifier: "SOFTFAIL",
				IPv4:      []string{"192.0.2.1", "192.0.2.2", "192.0.2.3", "192.0.2.4"},
			},
		},
		{
			name: "SPF with IPv4 Range",
			spf:  "v=spf1 ip4:192.168.1.0/24 -all",
			want: models.SpfRecord{
				Qualifier: "FAIL",
				IPv4:      []string{"192.168.1.0/24"},
			},
		},
		{
			name: "SPF with IPv6 Range",
			spf:  "v=spf1 ip6:2001:db8::/32 -all",
			want: models.SpfRecord{
				Qualifier: "FAIL",
				IPv6:      []string{"2001:db8::/32"},
			},
		},
		{
			name: "SPF with multiple mechanisms",
			spf:  "v=spf1 ip4:104.30.0.0/19 ip6:2405:8100:c000::/38 include:_spf.google.com ~all",
			want: models.SpfRecord{
				Qualifier: "SOFTFAIL",
				IPv4:      []string{"104.30.0.0/19"},
				IPv6:      []string{"2405:8100:c000::/38"},
				Include:   []string{"_spf.google.com"},
			},
		},
		{
			name: "_netblocks2.google.com",
			spf:  "v=spf1 ip6:2001:4860:4000::/36 ip6:2404:6800:4000::/36 ip6:2607:f8b0:4000::/36 ip6:2800:3f0:4000::/36 ip6:2a00:1450:4000::/36 ip6:2c0f:fb50:4000::/36 ~all",
			want: models.SpfRecord{
				Qualifier: "SOFTFAIL",
				IPv6:      []string{"2001:4860:4000::/36", "2404:6800:4000::/36", "2607:f8b0:4000::/36", "2800:3f0:4000::/36", "2a00:1450:4000::/36", "2c0f:fb50:4000::/36"},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := BreakDownSpf(tt.spf)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("BreakDownSpf() = %v, want %v", got, tt.want)
			}
		})
	}
}
