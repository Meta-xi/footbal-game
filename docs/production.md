# Production Deployment Guide

This document provides comprehensive instructions for building, deploying, and running the application in production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Building the Application](#building-the-application)
4. [Docker Deployment](#docker-deployment)
5. [Health Checks](#health-checks)
6. [Deployment Checklist](#deployment-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: v20+ (for local development)
- **Bun**: v1.0+ (package manager - required for builds)
- **Docker**: v20+ (for containerized deployment)
- **Docker Compose**: v2+ (optional, for local orchestration)

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API base URL | `https://api.example.com/` |
| `API_TIMEOUT` | HTTP request timeout (ms) | `30000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SENTRY_DSN` | Sentry error tracking DSN | (empty) |
| `ANALYTICS_KEY` | Analytics service API key | (empty) |
| `TAP_SECRET_KEY` | Secret key for TAP integration | (empty) |
| `CRYPTO_DEPOSIT_ADDRESS` | Crypto wallet address for deposits | (empty) |

### Setting Environment Variables

#### For Docker Build

Pass environment variables during build or use `--build-arg`:

```bash
docker build \
  --build-arg API_BASE_URL=https://api.example.com/ \
  --build-arg SENTRY_DSN=https://... \
  -t footbal-game:latest .
```

#### For Docker Compose

Create a `.env` file in the project root:

```bash
API_BASE_URL=https://api.example.com/
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
ANALYTICS_KEY=UA-XXXXX-X
```

#### For Kubernetes

Use ConfigMaps and Secrets:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: footbal-game-config
data:
  API_BASE_URL: "https://api.example.com/"
---
apiVersion: v1
kind: Secret
metadata:
  name: footbal-game-secrets
stringData:
  SENTRY_DSN: "https://xxxxx@sentry.io/xxxxx"
```

---

## Building the Application

### Local Build with Bun

```bash
# Install dependencies
bun install

# Run linter
bun run lint

# Run tests
bun test

# Build for production
bun run build
```

The production build artifacts are generated in `dist/nequi-v2-a21/browser/`.

### Build Output

```
dist/nequi-v2-a21/browser/
├── index.html
├── main.[hash].js        (main bundle)
├── polyfills.[hash].js   (polyfills)
├── runtime.[hash].js    (Angular runtime)
├── styles.[hash].css     (global styles)
└── assets/               (static assets)
```

---

## Docker Deployment

### Building the Docker Image

```bash
# Build the image
docker build -t footbal-game:latest .

# Or with build arguments
docker build \
  --build-arg API_BASE_URL=https://api.example.com/ \
  -t footbal-game:latest .
```

### Running the Container

```bash
# Run the container
docker run -d \
  --name footbal-game \
  -p 80:80 \
  -e API_BASE_URL=https://api.example.com/ \
  footbal-game:latest

# View logs
docker logs -f footbal-game
```

### Using Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - API_BASE_URL=${API_BASE_URL}
      - SENTRY_DSN=${SENTRY_DSN}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
    restart: unless-stopped
```

Start the services:

```bash
docker-compose up -d
```

### Multi-Stage Build Overview

The Dockerfile uses a two-stage build:

1. **Builder Stage**: Uses `oven/bun:1` to install dependencies and run the production build
2. **Production Stage**: Uses `nginx:alpine` to serve the static assets with optimized configuration

---

## Health Checks

### Container Health Check

The Docker image includes a built-in health check that verifies the web server is responding:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
```

### Application Health Endpoint

The Nginx configuration exposes a health check endpoint at `/health`:

```bash
# Test health endpoint
curl http://localhost/health

# Expected response: OK
```

### Kubernetes Liveness/Readiness Probes

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## Deployment Checklist

Before deploying to production, verify:

- [ ] All environment variables are configured
- [ ] CI pipeline passes (tests, build, lint)
- [ ] Bundle size is within budget limits
- [ ] Security headers are configured
- [ ] Health check endpoint responds correctly
- [ ] SSL/TLS is properly configured (via reverse proxy or load balancer)
- [ ] CDN is configured for static assets (optional)
- [ ] Monitoring is integrated (Sentry, analytics)
- [ ] Logging is functional

---

## Troubleshooting

### Build Failures

**Issue**: `bun run build` fails

**Solutions**:
1. Clear node_modules and reinstall: `rm -rf node_modules && bun install`
2. Verify Bun version: `bun --version` (should be v1.0+)
3. Check for TypeScript errors: `bun run lint`

### Container Fails to Start

**Issue**: Container exits immediately

**Solutions**:
1. Check logs: `docker logs footbal-game`
2. Verify nginx.conf is valid: `docker exec footbal-game nginx -t`
3. Ensure port 80 is not already in use

### Health Check Fails

**Issue**: Health endpoint returns non-200

**Solutions**:
1. Check if Nginx is running: `docker exec footbal-game ps aux | grep nginx`
2. Verify the application files exist: `docker exec footbal-game ls -la /usr/share/nginx/html`
3. Test manually: `curl http://localhost/health`

### Environment Variables Not Applied

**Issue**: Application uses wrong API URL or settings

**Solutions**:
1. Verify environment variables are set in container: `docker exec footbal-game env`
2. For production builds, ensure variables are passed via `--build-arg` or Docker Compose env_file
3. Rebuild the image after changing build arguments

---

## Security Notes

- **Never** commit secrets (API keys, DSNs) to version control
- Use Docker secrets or Kubernetes secrets for sensitive values
- Ensure the container runs as non-root user (nginx user)
- Keep Docker and Bun versions updated for security patches
- Review and update security headers in `nginx.conf` as needed

---

## Additional Resources

- [Angular Production Builds](https://angular.io/guide/build)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)