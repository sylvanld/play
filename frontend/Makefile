# This makefile is compatible windows/linux
ifdef OS
	VPYTHON=venv\Scripts\python
	VPIP=venv\Scripts\pip
else
   ifeq ($(shell uname), Linux)
		VPYTHON=venv/bin/python
    	VPIP=venv/bin/pip
   endif
endif

.PHONY: help

help: ## display this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: node_modules ## install required dependencies
	npm install

serve: ## run debug server in hot reload mode
	ng serve

build: ## build container and tag it as play-frontend
	docker build -t play-frontend .
