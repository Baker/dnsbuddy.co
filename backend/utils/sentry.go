package utils

import (
	"github.com/getsentry/sentry-go"
	"go.uber.org/zap"
)

func InitializeSentry() {
	DEBUG := GetEnvBool("SENTRY_DEBUG", false)
	DSN := GetEnv("SENTRY_DSN", "")
	TRACING_RATE := GetEnvFloat("SENTRY_TRACING_SAMPLE_RATE", 0.1)
	SAMPLE_RATE := GetEnvFloat("SENTRY_SAMPLE_RATE", 1.0)

	if err := sentry.Init(sentry.ClientOptions{
		Dsn:              DSN,
		EnableTracing:    true,
		Debug:            DEBUG,
		AttachStacktrace: true,
		SampleRate:       SAMPLE_RATE,
		TracesSampleRate: TRACING_RATE,
	}); err != nil {
		Logger.Error("ERROR: Sentry initialization failed: %v\n", zap.Error(err))
	}
}
