package utils

import (
	"fmt"
	"log"
	"strconv"

	"github.com/joho/godotenv"
	"os"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	err = ValidateEnv()
	if err != nil {
		log.Fatal(err)
	}

}

// RequiredEnvVars defines the list of required environment variables
var RequiredEnvVars = []string{
	"SENTRY_DSN",
	"PDCP_API_KEY",
}

// OptionalEnvVars defines the list of optional environment variables
var OptionalEnvVars = []string{
	// TODO: Add optional environment variables here
}

// ValidateEnv checks if all required environment variables are set
func ValidateEnv() error {
	for _, envVar := range RequiredEnvVars {
		if os.Getenv(envVar) == "" {
			return fmt.Errorf("%s is not set in the .env file", envVar)
		}
	}
	return nil
}

// GetEnv retrieves the value of an environment variable, using a default value if not set
func GetEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func GetEnvFloat(key string, defaultValue float64) float64 {
	value, err := strconv.ParseFloat(os.Getenv(key), 64)
	if err != nil {
		return defaultValue
	}
	return value
}
