.PHONY: help
.DEFAULT_GOAL := help

help: ## Show the command and description of it.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\nUsage: \033[36m%-30s\033[0m %s\n", $$1, $$2}'

# The above code is from https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html and modified by me.
