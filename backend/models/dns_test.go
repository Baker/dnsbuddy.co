package models

import (
	"encoding/json"
	"testing"
	"time"
)

func TestRecordTypeIsValid(t *testing.T) {
	tests := []struct {
		name     string
		rt       RecordType
		expected bool
	}{
		{"Valid A", A, true},
		{"Valid AAAA", AAAA, true},
		{"Valid NS", NS, true},
		{"Valid MX", MX, true},
		{"Valid SOA", SOA, true},
		{"Valid SRV", SRV, true},
		{"Valid PTR", PTR, true},
		{"Valid TXT", TXT, true},
		{"Valid CNAME", CNAME, true},
		{"Invalid", RecordType("INVALID"), false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.rt.IsValid(); got != tt.expected {
				t.Errorf("RecordType.IsValid() = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestDNSProviderIsValid(t *testing.T) {
	tests := []struct {
		name     string
		dp       DNSProvider
		expected bool
	}{
		{"Valid Cloudflare", Cloudflare, true},
		{"Valid Google", Google, true},
		{"Valid Quad9", Quad9, true},
		{"Invalid", DNSProvider("INVALID"), false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.dp.IsValid(); got != tt.expected {
				t.Errorf("DNSProvider.IsValid() = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestRecordTypeJSONMarshaling(t *testing.T) {
	tests := []struct {
		name     string
		rt       RecordType
		expected string
	}{
		{"A", A, `"A"`},
		{"AAAA", AAAA, `"AAAA"`},
		{"NS", NS, `"NS"`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			data, err := json.Marshal(tt.rt)
			if err != nil {
				t.Fatalf("Failed to marshal RecordType: %v", err)
			}
			if string(data) != tt.expected {
				t.Errorf("json.Marshal() = %s, want %s", data, tt.expected)
			}

			var unmarshaled RecordType
			err = json.Unmarshal(data, &unmarshaled)
			if err != nil {
				t.Fatalf("Failed to unmarshal RecordType: %v", err)
			}
			if unmarshaled != tt.rt {
				t.Errorf("json.Unmarshal() = %v, want %v", unmarshaled, tt.rt)
			}
		})
	}
}

func TestDNSProviderJSONMarshaling(t *testing.T) {
	tests := []struct {
		name     string
		dp       DNSProvider
		expected string
	}{
		{"Cloudflare", Cloudflare, `"CLOUDFLARE"`},
		{"Google", Google, `"GOOGLE"`},
		{"Quad9", Quad9, `"QUAD9"`},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			data, err := json.Marshal(tt.dp)
			if err != nil {
				t.Fatalf("Failed to marshal DNSProvider: %v", err)
			}
			if string(data) != tt.expected {
				t.Errorf("json.Marshal() = %s, want %s", data, tt.expected)
			}

			var unmarshaled DNSProvider
			err = json.Unmarshal(data, &unmarshaled)
			if err != nil {
				t.Fatalf("Failed to unmarshal DNSProvider: %v", err)
			}
			if unmarshaled != tt.dp {
				t.Errorf("json.Unmarshal() = %v, want %v", unmarshaled, tt.dp)
			}
		})
	}
}

func TestDNSRecordRequest(t *testing.T) {
	req := DNSRecordRequest{
		Query:    "example.com",
		Type:     A,
		Provider: Cloudflare,
	}

	data, err := json.Marshal(req)
	if err != nil {
		t.Fatalf("Failed to marshal DNSRecordRequest: %v", err)
	}

	var unmarshaled DNSRecordRequest
	err = json.Unmarshal(data, &unmarshaled)
	if err != nil {
		t.Fatalf("Failed to unmarshal DNSRecordRequest: %v", err)
	}

	if unmarshaled.Query != req.Query || unmarshaled.Type != req.Type || unmarshaled.Provider != req.Provider {
		t.Errorf("json.Unmarshal() = %+v, want %+v", unmarshaled, req)
	}
}

func TestDNSRecordResponse(t *testing.T) {
	resp := DNSRecordResponse{
		Host:       "example.com",
		Type:       A,
		TTL:        300,
		Resolver:   []string{"1.1.1.1", "1.0.0.1"},
		StatusCode: "OK",
		Timestamp:  time.Now(),
		TotalTime:  1000,
		Records: DNSRecords{
			A:  []string{"93.184.216.34"},
			NS: []string{"a.iana-servers.net", "b.iana-servers.net"},
		},
	}

	data, err := json.Marshal(resp)
	if err != nil {
		t.Fatalf("Failed to marshal DNSRecordResponse: %v", err)
	}

	var unmarshaled DNSRecordResponse
	err = json.Unmarshal(data, &unmarshaled)
	if err != nil {
		t.Fatalf("Failed to unmarshal DNSRecordResponse: %v", err)
	}

	if unmarshaled.Host != resp.Host || unmarshaled.TTL != resp.TTL || unmarshaled.StatusCode != resp.StatusCode {
		t.Errorf("json.Unmarshal() = %+v, want %+v", unmarshaled, resp)
	}

	if len(unmarshaled.Resolver) != len(resp.Resolver) || len(unmarshaled.Records.A) != len(resp.Records.A) || len(unmarshaled.Records.NS) != len(resp.Records.NS) {
		t.Errorf("json.Unmarshal() = %+v, want %+v", unmarshaled, resp)
	}
}

func TestInvalidRecordType(t *testing.T) {
	invalidRT := RecordType("INVALID")
	if invalidRT.IsValid() {
		t.Errorf("RecordType.IsValid() = true for invalid type %s", invalidRT)
	}

	// Test JSON unmarshaling for invalid RecordType
	invalidJSON := []byte(`"INVALID"`)
	var rt RecordType
	err := json.Unmarshal(invalidJSON, &rt)
	if err == nil {
		t.Errorf("Expected error when unmarshaling invalid RecordType, got nil")
	}
}

func TestInvalidDNSProvider(t *testing.T) {
	invalidDP := DNSProvider("INVALID")
	if invalidDP.IsValid() {
		t.Errorf("DNSProvider.IsValid() = true for invalid provider %s", invalidDP)
	}

	// Test JSON unmarshaling for invalid DNSProvider
	invalidJSON := []byte(`"INVALID"`)
	var dp DNSProvider
	err := json.Unmarshal(invalidJSON, &dp)
	if err == nil {
		t.Errorf("Expected error when unmarshaling invalid DNSProvider, got nil")
	}
}

func TestRecordTypeJSONUnmarshalingErrors(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		expectedErr string
	}{
		{"Empty string", `""`, "invalid RecordType: "},
		{"Number", `42`, "json: cannot unmarshal number into Go value of type string"},
		{"Null", `null`, "invalid RecordType: "},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var rt RecordType
			err := json.Unmarshal([]byte(tt.input), &rt)
			if err == nil {
				t.Errorf("Expected error, got nil")
			} else if err.Error() != tt.expectedErr {
				t.Errorf("Expected error %q, got %q", tt.expectedErr, err.Error())
			}
		})
	}
}

func TestDNSProviderJSONUnmarshalingErrors(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		expectedErr string
	}{
		{"Empty string", `""`, "invalid DNSProvider: "},
		{"Invalid provider", `"INVALID"`, "invalid DNSProvider: INVALID"},
		{"Number", `42`, "json: cannot unmarshal number into Go value of type string"},
		{"Null", `null`, "invalid DNSProvider: "},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var dp DNSProvider
			err := json.Unmarshal([]byte(tt.input), &dp)
			if err == nil {
				t.Errorf("Expected error, got nil")
			} else if err.Error() != tt.expectedErr {
				t.Errorf("Expected error %q, got %q", tt.expectedErr, err.Error())
			}
		})
	}
}

func TestDNSRecordRequestJSONUnmarshalingErrors(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		expectedErr string
	}{
		{"Invalid RecordType", `{"query":"example.com","type":"INVALID","provider":"cloudflare"}`, "invalid RecordType: INVALID"},
		{"Invalid DNSProvider", `{"query":"example.com","type":"A","provider":"INVALID"}`, "invalid DNSProvider: INVALID"},
		{"Invalid JSON", `{`, "unexpected end of JSON input"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var req DNSRecordRequest
			err := json.Unmarshal([]byte(tt.input), &req)
			if err == nil {
				t.Errorf("Expected error, got nil")
			} else if err.Error() != tt.expectedErr {
				t.Errorf("Expected error %q, got %q", tt.expectedErr, err.Error())
			}
		})
	}
}
