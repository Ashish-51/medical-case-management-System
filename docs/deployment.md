# Jajal Medical - AWS Deployment Guide

This document outlines the hosting architecture and deployment steps for deploying the Jajal Medical Case Management System on AWS.

## Architecture Overview

- **Compute**: AWS EC2 (t3.micro or t3.small, Ubuntu 22.04 LTS) running Nginx reverse proxy + Node.js/Express (PM2 process manager) or Docker container.
- **Database**: AWS RDS for MySQL 8.0 (Multi-AZ for high availability in production, Single-AZ micro for staging).
- **Storage**: AWS S3 for uploaded case attachments, implant docs, and static backup logs.
- **Security**: AWS Security Groups, AWS Secrets Manager for DB passwords & API keys, SSL/TLS via Let's Encrypt / Certbot.

---

## Step-by-Step Provisioning Guide

### 1. Database Provisioning (AWS RDS MySQL)
1. Navigate to AWS RDS Console -> Create Database.
2. Select **MySQL 8.0 Engine**, DB instance class `db.t3.micro`.
3. Set Master Username (`jajal_admin`) and secure Master Password.
4. Enable storage autoscaling and configure a VPC Private Subnet.
5. In Security Group, allow inbound MySQL traffic (Port `3306`) ONLY from the EC2 App Security Group.

### 2. Application Server Setup (AWS EC2)
1. Launch an EC2 Instance (`Ubuntu 22.04 LTS`, `t3.small`).
2. Attach an IAM Role with read-only permissions to AWS Secrets Manager and S3 bucket access.
3. SSH into EC2 and install Node.js 20 LTS, Nginx, and PM2:
   ```bash
   sudo apt update && sudo apt install -y nginx git
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

### 3. Application Deployment
1. Clone repository into `/var/www/jajal-medical`.
2. Configure `.env` file (fetched securely from AWS Secrets Manager):
   ```env
   PORT=3000
   NODE_ENV=production
   DB_HOST=jajal-db.cluster-xyz.us-east-1.rds.amazonaws.com
   DB_PORT=3306
   DB_NAME=jajal_medical_db
   DB_USER=jajal_admin
   DB_PASSWORD=SecureRDSSecretPassword!
   HOLIDAY_API_URL=https://date.nager.at/api/v3/PublicHolidays
   ```
3. Run build and start process:
   ```bash
   npm install --production=false
   npm run build
   pm2 start dist/server.js --name "jajal-medical-app"
   pm2 save
   pm2 startup
   ```

### 4. Nginx Reverse Proxy & SSL Setup
1. Create Nginx site configuration at `/etc/nginx/sites-available/jajal-medical`:
   ```nginx
   server {
       server_name medical.jajal.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```
2. Enable site and issue SSL Certificate using Certbot:
   ```bash
   sudo ln -s /etc/nginx/sites-available/jajal-medical /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d medical.jajal.com
   ```

---

## Security Groups Configuration

| Security Group | Direction | Protocol | Port Range | Source / Destination | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sg-web` (EC2) | Inbound | TCP | 80 | `0.0.0.0/0` | HTTP Web Traffic |
| `sg-web` (EC2) | Inbound | TCP | 443 | `0.0.0.0/0` | HTTPS Secured Traffic |
| `sg-web` (EC2) | Inbound | TCP | 22 | Administrator IP | SSH Maintenance |
| `sg-db` (RDS) | Inbound | TCP | 3306 | `sg-web` ID ONLY | Isolated Database Access |
