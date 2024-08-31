.PHONY: help
.DEFAULT_GOAL := help
INPUT :=

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run-backend: ## Run the backend server
	@cd backend && ~/go/bin/air -c .air.toml

backend-format: ## Format the backend code
	@cd backend && go fmt ./...

backend-test: ## Run the backend tests
	@cd backend && go test -race -coverprofile=coverage.out ./...

backend-coverage: ## Generate the backend coverage report
	@cd backend && go tool cover -html=coverage.out
