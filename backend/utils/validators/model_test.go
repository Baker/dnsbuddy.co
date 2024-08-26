package validators

import (
	"testing"
)

func TestIsValid(t *testing.T) {
	validMap := map[string]bool{
		"VALID1": true,
		"VALID2": true,
	}

	tests := []struct {
		name  string
		input string
		want  bool
	}{
		{"Valid uppercase", "VALID1", true},
		{"Valid lowercase", "valid2", true},
		{"Invalid value", "INVALID", false},
		{"Empty string", "", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsValid(tt.input, validMap); got != tt.want {
				t.Errorf("IsValid() = %v, want %v", got, tt.want)
			}
		})
	}
}

type TestEnum string

func TestUnmarshalJSON(t *testing.T) {
	validMap := map[TestEnum]bool{
		"VALID1": true,
		"VALID2": true,
	}

	tests := []struct {
		name    string
		input   string
		want    TestEnum
		wantErr bool
	}{
		{"Valid uppercase", `"VALID1"`, "VALID1", false},
		{"Valid lowercase", `"valid2"`, "VALID2", false},
		{"Empty string", `""`, TestEnum(""), true},
		{"Non-string JSON", `123`, TestEnum(""), true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var got TestEnum
			err := UnmarshalJSON([]byte(tt.input), &got, validMap, "TestEnum")
			if (err != nil) != tt.wantErr {
				t.Errorf("UnmarshalJSON() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("UnmarshalJSON() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestUnmarshalJSONWithCustomType(t *testing.T) {
	type CustomString string
	validMap := map[CustomString]bool{
		"VALID1": true,
		"VALID2": true,
	}

	var got CustomString
	err := UnmarshalJSON([]byte(`"valid1"`), &got, validMap, "CustomString")
	if err != nil {
		t.Errorf("UnmarshalJSON() error = %v, wantErr false", err)
	}
	if got != "VALID1" {
		t.Errorf("UnmarshalJSON() = %v, want VALID1", got)
	}
}
