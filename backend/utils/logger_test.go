package utils

import (
	"testing"

	"go.uber.org/zap"
)

func TestInitializeLogger(t *testing.T) {
	Logger = nil

	InitializeLogger()

	if Logger == nil {
		t.Error("Logger was not initialized")
	}

	if ce := Logger.Check(zap.DebugLevel, "test message"); ce != nil {
		t.Error("Logger is not a production logger (it allows debug level logging)")
	}
}
