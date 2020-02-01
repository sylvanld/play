PYTHON=python3

serve-backend:
	cd backend && make serve

serve-frontend:
	cd frontend && make serve

deploy:
	$(PYTHON) -m script.deploy