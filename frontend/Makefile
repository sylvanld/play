.PHONY: help

help: ## display this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

node_modules: ## install required dependencies
	npm install

serve: node_modules ## run debug server in hot reload mode
	ng serve

build: ## build container and tag it as play-frontend
	docker build -t everrest/play-frontend .
