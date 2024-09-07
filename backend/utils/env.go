package utils

import (
	"strconv"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"os"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		Logger.Error("Error loading .env file", zap.Error(err))
	}
	err = ValidateEnv()
	if err != nil {
		Logger.Error("Error validating environment variables", zap.Error(err))
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
			Logger.Error("ERROR: Environment variable %s is not set\n", zap.String("envVar", envVar))
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

func GetEnvBool(key string, defaultValue bool) bool {
	value, err := strconv.ParseBool(os.Getenv(key))
	if err != nil {
		return defaultValue
	}
	return value
}
