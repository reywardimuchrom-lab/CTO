# Deployment Guide

This guide covers deploying the MyApp monorepo to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)
- [Rollback Procedures](#rollback-procedures)

## Prerequisites

- Docker and Docker Compose
- Access to production servers
- SSL certificates
- Domain names configured
- Database backups

## Environment Configuration

### Environment Variables

Create environment-specific `.env` files:

**Production:**
```bash
# Application
APP_ENV=production
APP_PORT=8080

# Database
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=myapp_prod
DB_SSL_MODE=require

# JWT
JWT_SECRET=very-secure-production-secret
JWT_EXPIRATION=24h

# SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# QRIS
QRIS_ENVIRONMENT=production
QRIS_API_KEY=prod-api-key
QRIS_API_SECRET=prod-api-secret
```

### Secrets Management

Use a secrets manager for sensitive data:

**AWS Secrets Manager:**
```bash
aws secretsmanager create-secret \
  --name myapp/production/db \
  --secret-string '{"password":"secure_password"}'
```

**HashiCorp Vault:**
```bash
vault kv put secret/myapp/production \
  db_password=secure_password \
  jwt_secret=very-secure-secret
```

## Docker Deployment

### Build Images

```bash
# Build all services
docker-compose build

# Tag for registry
docker tag myapp-backend:latest registry.example.com/myapp-backend:v1.0.0
docker tag myapp-web:latest registry.example.com/myapp-web:v1.0.0

# Push to registry
docker push registry.example.com/myapp-backend:v1.0.0
docker push registry.example.com/myapp-web:v1.0.0
```

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: registry.example.com/myapp-backend:v1.0.0
    restart: always
    env_file:
      - .env.production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    image: registry.example.com/myapp-web:v1.0.0
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - web
```

### Deploy

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## Cloud Deployment

### AWS Deployment

#### Using ECS

1. Create ECR repositories:
```bash
aws ecr create-repository --repository-name myapp-backend
aws ecr create-repository --repository-name myapp-web
```

2. Push images to ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag myapp-backend:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/myapp-backend:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/myapp-backend:latest
```

3. Create ECS task definitions and services

4. Configure Application Load Balancer

#### Using Elastic Beanstalk

```bash
# Initialize EB
eb init -p docker myapp-backend

# Create environment
eb create production-env

# Deploy
eb deploy
```

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/myapp-backend
gcloud run deploy myapp-backend \
  --image gcr.io/PROJECT_ID/myapp-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Build and deploy web
gcloud builds submit --tag gcr.io/PROJECT_ID/myapp-web
gcloud run deploy myapp-web \
  --image gcr.io/PROJECT_ID/myapp-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean

#### Using App Platform

1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

## Database Setup

### PostgreSQL Production Setup

#### AWS RDS

```bash
aws rds create-db-instance \
  --db-instance-identifier myapp-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --master-username admin \
  --master-user-password secure_password \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --multi-az
```

#### Managed PostgreSQL

Most cloud providers offer managed PostgreSQL:
- AWS RDS
- Google Cloud SQL
- Azure Database for PostgreSQL
- DigitalOcean Managed Databases

### Database Migrations

```bash
# Run migrations on production
docker-compose exec backend ./migrate up

# Or manually
psql -h prod-db.example.com -U prod_user -d myapp_prod -f migrations/001_init.sql
```

### Database Backups

**Automated Backups:**
```bash
# Create backup script
#!/bin/bash
BACKUP_FILE="myapp_backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump -h prod-db.example.com -U prod_user myapp_prod > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE.gz s3://myapp-backups/
```

**Schedule with cron:**
```cron
0 2 * * * /path/to/backup-script.sh
```

## Nginx Configuration

### Production nginx.conf

```nginx
upstream backend {
    server backend:8080;
}

upstream web {
    server web:80;
}

server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/TLS Setup

### Using Let's Encrypt

```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d example.com -d www.example.com

# Auto-renewal
certbot renew --dry-run
```

### Manual Certificate

```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate CSR
openssl req -new -key key.pem -out csr.pem

# Get certificate from CA
# Place cert.pem and key.pem in /etc/nginx/ssl/
```

## Monitoring

### Application Monitoring

**Health Checks:**
```bash
# Backend health
curl https://api.example.com/api/v1/health

# Expected response
{"status":"healthy","service":"api"}
```

**Monitoring Tools:**
- Prometheus + Grafana
- DataDog
- New Relic
- AWS CloudWatch

### Log Aggregation

**Using ELK Stack:**
1. Install Elasticsearch
2. Install Logstash
3. Install Kibana
4. Configure Filebeat

**Using Cloud Services:**
- AWS CloudWatch Logs
- Google Cloud Logging
- Datadog Logs

### Alerting

Set up alerts for:
- High error rates
- Slow response times
- High CPU/memory usage
- Database connection issues
- SSL certificate expiration

## Performance Optimization

### Backend

- Enable connection pooling
- Implement caching (Redis)
- Use CDN for static assets
- Optimize database queries
- Enable gzip compression

### Frontend

- Minify and bundle assets
- Use CDN
- Implement lazy loading
- Optimize images
- Enable browser caching

### Database

- Create proper indexes
- Regular VACUUM
- Connection pooling
- Read replicas for scaling

## Rollback Procedures

### Quick Rollback

```bash
# Rollback to previous version
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml pull myapp-backend:v0.9.0
docker-compose -f docker-compose.prod.yml up -d
```

### Database Rollback

```bash
# Restore from backup
pg_restore -h prod-db.example.com -U prod_user -d myapp_prod backup.sql
```

### Git Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Trigger deployment
```

## Security Checklist

- [ ] Environment variables secured
- [ ] SSL/TLS configured
- [ ] Firewall rules configured
- [ ] Database access restricted
- [ ] Strong passwords used
- [ ] Regular security updates
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

## Post-Deployment

### Verification

```bash
# Check services
curl https://api.example.com/api/v1/health
curl https://example.com

# Check logs
docker-compose logs -f backend
docker-compose logs -f web

# Monitor metrics
# Check monitoring dashboard
```

### Documentation

- Update deployment log
- Document any issues
- Update runbooks
- Notify team

## Troubleshooting

### Common Issues

**Service not starting:**
```bash
docker-compose logs backend
# Check environment variables
# Verify database connection
```

**Database connection failed:**
```bash
# Test connection
psql -h prod-db.example.com -U prod_user -d myapp_prod
# Check security groups/firewall
# Verify credentials
```

**High memory usage:**
```bash
# Check container stats
docker stats
# Scale up resources if needed
```

## Support

For deployment issues:
- Check logs first
- Review documentation
- Contact DevOps team
- Create incident ticket

## Continuous Deployment

Set up CI/CD pipeline (see `.github/workflows` or `.gitlab-ci.yml`) for automatic deployments on:
- Merge to main → Deploy to staging
- Tagged release → Deploy to production
