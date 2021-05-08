# Builder image that will contains build dependencies
FROM python:3.8-alpine AS builder

WORKDIR /build

# install build requirements
RUN apk add --no-cache gcc musl-dev libffi-dev
RUN pip install virtualenv

# install/build dependencies in a virtualenv
RUN python -m virtualenv venv
COPY requirements/prod /tmp/requirements
RUN /build/venv/bin/pip install -r /tmp/requirements

# Final image only containing runtime dependencies
FROM python:3.8-alpine

WORKDIR /api

COPY --from=builder /build/venv /api/venv
COPY . .

ENV FLASK_ENV=production

EXPOSE 80
CMD ["/api/venv/bin/python", "-m", "gunicorn", "-b", "0.0.0.0:80", "server:app"]
