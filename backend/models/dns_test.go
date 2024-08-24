package models

import (
	"net"
	"testing"
)

func TestResolveDomain(t *testing.T) {
	tests := []struct {
		name    string
		domain  string
		wantIP  bool
		wantErr bool
	}{
		{"Valid Domain", "example.com", true, false},
		{"Invalid Domain", "invalid.domain.that.does.not.exist", false, true},
		{"Empty Domain", "", false, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ips, err := net.LookupIP(tt.domain)
			if (err != nil) != tt.wantErr {
				t.Errorf("ResolveDomain(%s) error = %v, wantErr %v", tt.domain, err, tt.wantErr)
				return
			}
			if tt.wantIP && len(ips) == 0 {
				t.Errorf("ResolveDomain(%s) returned no IPs, expected at least one", tt.domain)
			}
		})
	}
}

func TestCheckMXRecords(t *testing.T) {
	tests := []struct {
		name    string
		domain  string
		wantMX  bool
		wantErr bool
	}{
		{"Valid Domain with MX", "gmail.com", true, false},
		{"Valid Domain without MX", "example.com", false, false},
		{"Invalid Domain", "invalid.domain.that.does.not.exist", false, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mxRecords, err := net.LookupMX(tt.domain)
			if (err != nil) != tt.wantErr {
				t.Errorf("CheckMXRecords(%s) error = %v, wantErr %v", tt.domain, err, tt.wantErr)
				return
			}
			if tt.wantMX && len(mxRecords) == 0 {
				t.Errorf("CheckMXRecords(%s) returned no MX records, expected at least one", tt.domain)
			}
		})
	}
}

func TestVerifyTXTRecords(t *testing.T) {
	tests := []struct {
		name    string
		domain  string
		wantTXT bool
		wantErr bool
	}{
		{"Valid Domain with TXT", "google.com", true, false},
		{"Valid Domain without TXT", "example.com", false, false},
		{"Invalid Domain", "invalid.domain.that.does.not.exist", false, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			txtRecords, err := net.LookupTXT(tt.domain)
			if (err != nil) != tt.wantErr {
				t.Errorf("VerifyTXTRecords(%s) error = %v, wantErr %v", tt.domain, err, tt.wantErr)
				return
			}
			if tt.wantTXT && len(txtRecords) == 0 {
				t.Errorf("VerifyTXTRecords(%s) returned no TXT records, expected at least one", tt.domain)
			}
		})
	}
}