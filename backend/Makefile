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

venv:
	pip3 install virtualenv
	virtualenv -p python3 venv

install: venv ## create virtualenv and install dependencies
	$(VPIP) install -r requirements/dev

serve: ## run debug server in hot reload mode
	$(VPYTHON) server.py

build: ## build container and tag it as play-backend
	docker build -t play-backend .
