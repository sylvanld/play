PYTHON=python3

serve-backend:
	cd backend && make serve

serve-frontend:
	cd frontend && make serve

version:
	$(PYTHON) -m script.deploy

deploy:
	ansible-playbook -i devops/hosts devops/deploy-playbook.yml

ssh:
	ssh sylvan@sylvan.ovh