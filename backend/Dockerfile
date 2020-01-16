FROM python:3.6-slim

RUN pip install gunicorn

COPY requirements/prod requirements
RUN pip install -r requirements
COPY . .

CMD ["gunicorn", "-b", "0.0.0.0:80", "server:app"]
