package utils

import (
	"backend/models"
	"github.com/miekg/dns"
	retryabledns "github.com/projectdiscovery/retryabledns"
	"reflect"
	"testing"
)

func TestRecordTypeToUint16(t *testing.T) {
	tests := []struct {
		name    string
		rt      models.RecordType
		want    uint16
		wantErr bool
	}{
		{"A record", models.A, dns.TypeA, false},
		{"AAAA record", models.AAAA, dns.TypeAAAA, false},
		{"CNAME record", models.CNAME, dns.TypeCNAME, false},
		{"MX record", models.MX, dns.TypeMX, false},
		{"NS record", models.NS, dns.TypeNS, false},
		{"PTR record", models.PTR, dns.TypePTR, false},
		{"SOA record", models.SOA, dns.TypeSOA, false},
		{"SRV record", models.SRV, dns.TypeSRV, false},
		{"TXT record", models.TXT, dns.TypeTXT, false},
		{"Invalid record", models.RecordType("INVALID"), dns.TypeNone, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := RecordTypeToUint16(tt.rt)
			if (err != nil) != tt.wantErr {
				t.Errorf("RecordTypeToUint16() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("RecordTypeToUint16() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestParseRecords(t *testing.T) {
	tests := []struct {
		name       string
		result     *retryabledns.DNSData
		recordType string
		want       models.DNSRecords
		wantErr    bool
	}{
		{
			name: "A record",
			result: &retryabledns.DNSData{
				A: []string{"192.0.2.1", "192.0.2.2"},
			},
			recordType: "A",
			want: models.DNSRecords{
				A: []string{"192.0.2.1", "192.0.2.2"},
			},
			wantErr: false,
		},
		{
			name: "AAAA record",
			result: &retryabledns.DNSData{
				AAAA: []string{"2001:db8::1", "2001:db8::2"},
			},
			recordType: "AAAA",
			want: models.DNSRecords{
				AAAA: []string{"2001:db8::1", "2001:db8::2"},
			},
			wantErr: false,
		},
		{
			name: "CNAME record",
			result: &retryabledns.DNSData{
				CNAME: []string{"alias.example.com."},
			},
			recordType: "CNAME",
			want: models.DNSRecords{
				CNAME: []string{"alias.example.com."},
			},
			wantErr: false,
		},
		{
			name: "MX record",
			result: &retryabledns.DNSData{
				RawResp: &dns.Msg{
					Answer: []dns.RR{
						&dns.MX{
							Mx:         "mail.example.com.",
							Preference: 10,
						},
					},
				},
			},
			recordType: "MX",
			want: models.DNSRecords{
				MX: []models.MXRecord{
					{Host: "mail.example.com.", Pref: 10},
				},
			},
			wantErr: false,
		},
		{
			name: "NS record",
			result: &retryabledns.DNSData{
				NS: []string{"ns1.example.com.", "ns2.example.com."},
			},
			recordType: "NS",
			want: models.DNSRecords{
				NS: []string{"ns1.example.com.", "ns2.example.com."},
			},
			wantErr: false,
		},
		{
			name: "PTR record",
			result: &retryabledns.DNSData{
				PTR: []string{"host.example.com."},
			},
			recordType: "PTR",
			want: models.DNSRecords{
				PTR: []string{"host.example.com."},
			},
			wantErr: false,
		},
		{
			name: "TXT record",
			result: &retryabledns.DNSData{
				TXT: []string{"v=spf1 include:_spf.example.com ~all"},
			},
			recordType: "TXT",
			want: models.DNSRecords{
				TXT: []string{"v=spf1 include:_spf.example.com ~all"},
			},
			wantErr: false,
		},
		{
			name: "SRV record",
			result: &retryabledns.DNSData{
				SRV: []string{"_sip._tcp.example.com."},
			},
			recordType: "SRV",
			want: models.DNSRecords{
				SRV: []string{"_sip._tcp.example.com."},
			},
			wantErr: false,
		},
		{
			name:       "Invalid record type",
			result:     &retryabledns.DNSData{},
			recordType: "INVALID",
			want:       models.DNSRecords{},
			wantErr:    true,
		},
		{
			name: "SOA record",
			result: &retryabledns.DNSData{
				SOA: []retryabledns.SOA{
					{
						Name:    "example.com.",
						NS:      "ns1.example.com.",
						Mbox:    "admin.example.com.",
						Serial:  2023060101,
						Refresh: 7200,
						Retry:   3600,
						Expire:  1209600,
						Minttl:  300,
					},
				},
			},
			recordType: "SOA",
			want: models.DNSRecords{
				SOA: []models.SOARecord{
					{
						Name:    "example.com.",
						NS:      "ns1.example.com.",
						Mbox:    "admin.example.com.",
						Serial:  2023060101,
						Refresh: 7200,
						Retry:   3600,
						Expire:  1209600,
						Minttl:  300,
					},
				},
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseRecords(tt.result, tt.recordType)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseRecords() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ParseRecords() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestFetchDnsProvider(t *testing.T) {
	tests := []struct {
		name     string
		provider models.DNSProvider
		want     []string
		wantErr  bool
	}{
		{"Cloudflare", models.Cloudflare, []string{"1.1.1.1", "1.0.0.1"}, false},
		{"Google", models.Google, []string{"8.8.8.8", "8.8.4.4"}, false},
		{"Quad9", models.Quad9, []string{"9.9.9.9", "149.112.112.112"}, false},
		{"DNSFilter", models.DNSFilter, []string{"103.247.36.36", "103.247.37.37"}, false},
		{"OpenDNS", models.OpenDNS, []string{"208.67.222.222", "208.67.220.220"}, false},
		{"DynDNS", models.DynDNS, []string{"216.146.35.35", "216.146.36.36"}, false},
		{"CenturyLink", models.CenturyLink, []string{"205.171.3.65", "205.171.2.65"}, false},
		{"Invalid provider", models.DNSProvider("INVALID"), nil, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := FetchDnsProvider(tt.provider)
			if (err != nil) != tt.wantErr {
				t.Errorf("FetchDnsProvider() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("FetchDnsProvider() = %v, want %v", got, tt.want)
			}
		})
	}
}
