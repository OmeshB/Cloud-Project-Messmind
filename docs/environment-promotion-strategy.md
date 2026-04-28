# Messmind — Environment Promotion Strategy

## Overview

This document describes how code changes flow from a developer's machine through to production for the **Messmind** college mess management system. The strategy follows a **Dev → Staging → Production** pipeline using Docker Hub as the container registry and Helm as the Kubernetes deployment tool.

---

## Environments

| Environment | Namespace | Image Tag | Replicas | Purpose |
|-------------|-----------|-----------|----------|---------|
| **Development** | `messmind` (local) | `latest` | 1 | Local development & feature testing |
| **Staging** | `messmind` (AKS staging cluster) | `staging` | 1 | Pre-production integration testing |
| **Production** | `messmind` (AKS prod cluster) | `1.0.0` (semver) | 2 | Live user traffic |

---

## Container Registry

Images are pushed to **Docker Hub** under the `omeshbala` namespace:

| Service | Repository |
|---------|-----------|
| Frontend (Nginx + React) | `omeshbala/messmind-frontend` |
| Backend (Express API) | `omeshbala/messmind-backend` |

> **Note:** For a production-grade Azure deployment, consider migrating to **Azure Container Registry (ACR)** which integrates natively with AKS and supports geo-replication and role-based access control.

---

## Promotion Workflow

```
Developer Machine
      │
      │  git push → GitHub
      ▼
┌─────────────┐
│  GitHub     │  Triggers GitHub Actions CI pipeline
│  Actions    │──────────────────────────────────────────────────────────┐
└─────────────┘                                                           │
      │                                                                   │
      │  1. npm test (unit tests pass)                                    │
      │  2. docker build                                                  │
      │  3. docker push omeshbala/messmind-*:staging                     │
      ▼                                                                   │
┌──────────────────────┐                                                  │
│  STAGING ENVIRONMENT │  helm upgrade --install messmind ./helm/messmind │
│  (AKS / Minikube)   │  -f values-staging.yaml                          │
│  Image tag: staging  │◄────────────────────────────────────────────────┘
└──────────────────────┘
      │
      │  ✅ Manual QA approval / automated smoke tests pass
      │
      │  3. docker tag staging → 1.x.x (semver release)
      │  4. docker push omeshbala/messmind-*:1.x.x
      ▼
┌──────────────────────┐
│  PRODUCTION          │  helm upgrade messmind ./helm/messmind
│  (AKS prod cluster)  │  -f values-prod.yaml
│  Image tag: 1.x.x    │  --set image.backend.tag=1.x.x \
└──────────────────────┘  --set image.frontend.tag=1.x.x
```

---

## Step-by-Step Promotion

### Stage 1: Local Development

```bash
# Run locally with Docker Compose
cd Frontend/
docker compose up --build

# App available at:
#   Frontend → http://localhost:3000
#   Backend  → http://localhost:5000/api/ping
```

### Stage 2: Push to Staging

```bash
# Build and tag for staging
docker compose build
docker tag omeshbala/messmind-backend:latest omeshbala/messmind-backend:staging
docker tag omeshbala/messmind-frontend:latest omeshbala/messmind-frontend:staging

# Push staging images
docker push omeshbala/messmind-backend:staging
docker push omeshbala/messmind-frontend:staging

# Deploy to staging cluster
helm upgrade --install messmind ./helm/messmind \
  -f helm/messmind/values-staging.yaml \
  --namespace messmind --create-namespace
```

### Stage 3: Promote to Production

```bash
# Tag with a versioned release (e.g., 1.0.1)
VERSION=1.0.1
docker tag omeshbala/messmind-backend:staging omeshbala/messmind-backend:$VERSION
docker tag omeshbala/messmind-frontend:staging omeshbala/messmind-frontend:$VERSION
docker push omeshbala/messmind-backend:$VERSION
docker push omeshbala/messmind-frontend:$VERSION

# Deploy to production cluster (2 replicas, pinned version)
helm upgrade --install messmind ./helm/messmind \
  -f helm/messmind/values-prod.yaml \
  --set image.backend.tag=$VERSION \
  --set image.frontend.tag=$VERSION \
  --namespace messmind --create-namespace
```

### Rollback

```bash
# Instantly rollback to the previous Helm release
helm rollback messmind 0 --namespace messmind

# Or target a specific revision
helm history messmind --namespace messmind
helm rollback messmind <REVISION> --namespace messmind
```

---

## Image Tagging Strategy

| Tag | Used For | Example |
|-----|----------|---------|
| `latest` | Local development only | `omeshbala/messmind-backend:latest` |
| `staging` | Staging environment (mutable) | `omeshbala/messmind-backend:staging` |
| `x.y.z` | Production releases (immutable) | `omeshbala/messmind-backend:1.0.1` |

> ⚠️ **Never use `latest` in production.** Pinned semver tags ensure reproducible deployments and safe rollbacks.

---

## Secret Management

Secrets (DB passwords, API keys) are **never baked into the image** or committed to Git. They are injected at deploy time via Kubernetes Secrets:

```bash
# Create secrets once per cluster (dev/staging/prod each get their own values)
kubectl create secret generic messmind-secrets \
  --from-literal=DB_SERVER=<your-db-server> \
  --from-literal=DB_DATABASE=<your-db-name> \
  --from-literal=DB_USER=<your-db-user> \
  --from-literal=DB_PASSWORD=<your-db-password> \
  --from-literal=AZURE_STORAGE_CONNECTION_STRING=<connection-string> \
  --from-literal=GEMINI_API_KEY=<key> \
  --from-literal=GROQ_API_KEY=<key> \
  --from-literal=AZURE_API_KEY=<key> \
  --from-literal=AZURE_ENDPOINT=<endpoint> \
  --from-literal=AZURE_CONTENT_SAFETY_KEY=<key> \
  --from-literal=AZURE_CONTENT_SAFETY_ENDPOINT=<endpoint> \
  --namespace messmind
```

---

## Repository File Structure

```
Frontend/
├── dockerfile                   ← Frontend (Nginx) container build
├── server/dockerfile            ← Backend (Express) container build
├── .dockerignore                ← Files excluded from Docker build context
├── docker-compose.yml           ← Local multi-container orchestration
│
├── k8s/                         ← Raw Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-service.yaml
│   └── secrets.yaml.template    ← Template only — real values via kubectl
│
└── helm/messmind/               ← Helm chart (templated k8s manifests)
    ├── Chart.yaml
    ├── values.yaml              ← Default values
    ├── values-dev.yaml          ← Development overrides
    ├── values-staging.yaml      ← Staging overrides
    ├── values-prod.yaml         ← Production overrides
    └── templates/
        ├── namespace.yaml
        ├── deployment.yaml
        └── service.yaml
```

---

## Checklist Status

| Requirement | Status |
|-------------|--------|
| Dockerfile in repo (frontend) | ✅ `Frontend/dockerfile` |
| Dockerfile in repo (backend) | ✅ `Frontend/server/dockerfile` |
| `.dockerignore` in repo | ✅ `Frontend/.dockerignore` |
| Container image pushed to registry | ✅ Docker Hub (`omeshbala/messmind-*`) |
| Kubernetes YAMLs | ✅ `Frontend/k8s/` |
| Helm chart for deployment | ✅ `Frontend/helm/messmind/` |
| Environment promotion strategy | ✅ This document |
