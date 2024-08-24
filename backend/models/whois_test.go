package models

import (
	"encoding/json"
	"testing"
)

func TestWhoisLookupType_IsValid(t *testing.T) {
	tests := []struct {
		name string
		t    WhoisLookupType
		want bool
	}{
		{"Valid Domain", Domain, true},
		{"Valid IP", IP, true},
		{"Valid ASN", ASN, true},
		{"Valid Lowercase", WhoisLookupType("domain"), true},
		{"Invalid Type", WhoisLookupType("INVALID"), false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.t.IsValid(); got != tt.want {
				t.Errorf("WhoisLookupType.IsValid() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestWhoisLookupType_UnmarshalJSON(t *testing.T) {
	tests := []struct {
		name    string
		json    string
		want    WhoisLookupType
		wantErr bool
	}{
		{"Valid Domain", `"DOMAIN"`, Domain, false},
		{"Valid IP", `"IP"`, IP, false},
		{"Valid ASN", `"ASN"`, ASN, false},
		{"Valid Lowercase", `"domain"`, Domain, false},
		{"Invalid Type", `"INVALID"`, "", true},
		{"Invalid JSON", `{"type": "DOMAIN"}`, "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var got WhoisLookupType
			err := json.Unmarshal([]byte(tt.json), &got)
			if (err != nil) != tt.wantErr {
				t.Errorf("WhoisLookupType.UnmarshalJSON() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("WhoisLookupType.UnmarshalJSON() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestWhoisLookupType_MarshalJSON(t *testing.T) {
	tests := []struct {
		name    string
		t       WhoisLookupType
		want    string
		wantErr bool
	}{
		{"Domain", Domain, `"DOMAIN"`, false},
		{"IP", IP, `"IP"`, false},
		{"ASN", ASN, `"ASN"`, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := json.Marshal(tt.t)
			if (err != nil) != tt.wantErr {
				t.Errorf("WhoisLookupType.MarshalJSON() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if string(got) != tt.want {
				t.Errorf("WhoisLookupType.MarshalJSON() = %v, want %v", string(got), tt.want)
			}
		})
	}
}