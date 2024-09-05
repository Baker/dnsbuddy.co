package utils

import (
	"log"
	"os"

	"github.com/getsentry/sentry-go"
)

func InitializeSentry() {
	if err := sentry.Init(sentry.ClientOptions{
		Dsn:              os.Getenv("SENTRY_DSN"),
		EnableTracing:    true,
		TracesSampleRate: 1.0,
	}); err != nil {
		log.Fatalf("ERROR: Sentry initialization failed: %v\n", err)
	}
}
