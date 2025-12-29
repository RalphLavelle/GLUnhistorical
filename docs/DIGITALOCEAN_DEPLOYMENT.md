# DigitalOcean App Platform Deployment Guide

This guide walks you through deploying the Gold Coast Unhistorical Walking Tours application to DigitalOcean App Platform.

## Architecture

```mermaid
flowchart LR
    subgraph do [DigitalOcean App Platform]
        BE[Express Backend<br/>Serves API + Angular Static]
    end
    subgraph atlas [MongoDB Atlas]
        DB[(MongoDB<br/>Free M0 Cluster)]
    end
    User --> BE
    BE --> DB
```

**Key Points:**
- Single app deployment (Express serves both API and Angular static files)
- DigitalOcean handles infrastructure, SSL, CDN, and scaling
- MongoDB Atlas hosted separately (already configured)
- Express code works as-is (no serverless conversion needed)

---

## Prerequisites

1. **DigitalOcean Account**
   - Sign up at [digitalocean.com](https://www.digitalocean.com/)
   - Add payment method (required, but Basic plan is $5/month)

2. **MongoDB Atlas Account**
   - Free M0 cluster at [atlas.mongodb.com](https://atlas.mongodb.com)
   - Database user with read/write permissions
   - Connection string ready: `mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/gcobscura`

3. **GitHub Repository**
   - Code pushed to GitHub (public or private)
   - DigitalOcean can connect to GitHub for auto-deployments

---

## Deployment Steps

### Step 1: Prepare Your Code

Ensure your code is ready for deployment:

**On Windows (PowerShell):**
```powershell
# Build frontend
cd frontend
npm run build

# Build backend
cd ..\backend
npm run build

# Verify builds succeeded
Test-Path "frontend\dist\frontend\browser\index.html"  # Should return True
Test-Path "backend\dist\server.js"  # Should return True
```

**On Linux/Mac (Bash):**
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Verify builds succeeded
ls frontend/dist/frontend/browser  # Should contain index.html and assets
ls backend/dist  # Should contain server.js
```

**Important**: 
- The backend is configured to serve Angular static files in production mode. This happens automatically when `NODE_ENV=production`.
- **Note**: The build command in DigitalOcean uses `&&` (bash syntax) because it runs on Linux. For local PowerShell testing, run the commands separately as shown above.

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for DigitalOcean deployment"
git push origin main
```

### Step 3: Create App in DigitalOcean

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **Create App**
3. Select **GitHub** as your source
4. Authorize DigitalOcean to access your GitHub account (if first time)
5. Select your repository: `YOUR_USERNAME/GCObscura`
6. Select branch: `main`
7. Click **Next**

### Step 4: Configure App Settings

DigitalOcean will auto-detect Node.js. Configure as follows:

#### Basic Settings

- **Resource Type**: Web Service (default)
- **Name**: `gcobscura` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `San Francisco`, `New York`, `Singapore`)

#### Build & Run Commands

- **Build Command**:
  ```
  cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
  ```
  
  **Note**: This uses `&&` (bash syntax) because DigitalOcean runs builds on Linux. For local PowerShell testing, run commands separately:
  ```powershell
  cd frontend; npm install; npm run build; cd ..\backend; npm install; npm run build
  ```
  
  This command:
  1. Installs frontend dependencies
  2. Builds Angular app → `frontend/dist/frontend/browser/`
  3. Installs backend dependencies
  4. Compiles TypeScript → `backend/dist/`

- **Run Command**:
  ```
  cd backend && npm start
  ```
  
  Starts the Express server which serves both API and Angular static files.
  
  **Note**: For local PowerShell testing, use: `cd backend; npm start`

#### HTTP Settings

- **HTTP Port**: `3000` (Express default, matches your code)
- **HTTP Request Routes**: `/` (default - serves all routes)

#### Health Check

- **HTTP Path**: `/api/health`
- **Initial Delay**: `30` seconds (gives MongoDB time to connect)
- **Period**: `10` seconds
- **Timeout**: `5` seconds
- **Success Threshold**: `1`
- **Failure Threshold**: `3`

### Step 5: Choose Plan

Select a plan based on your needs:

- **Basic Plan - Basic-XXS**: $5/month
  - 512 MB RAM
  - 1 vCPU
  - Good for starting out, low traffic
  
- **Basic Plan - Basic-XS**: $12/month
  - 1 GB RAM
  - 1 vCPU
  - Better for moderate traffic

**Recommendation**: Start with Basic-XXS ($5/month). You can scale up later.

### Step 6: Set Environment Variables

Go to **Settings** → **App-Level Environment Variables** and add:

| Variable | Value | Type |
|----------|-------|------|
| `NODE_ENV` | `production` | Plain Text |
| `MONGODB_URI` | `mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/gcobscura` | **SECRET** |
| `MONGODB_DB_NAME` | `gcobscura` | Plain Text |
| `PORT` | `3000` | Plain Text (optional - App Platform sets this automatically) |

**Important**: 
- Mark `MONGODB_URI` as **SECRET** to hide it in logs
- Replace `USER`, `PASS`, and `cluster.xxxxx` with your actual Atlas credentials

### Step 7: Review and Deploy

1. Review all settings
2. Click **Create Resources**
3. Wait for build and deployment (5-10 minutes)
4. Your app will be live at: `https://gcobscura-xxxxx.ondigitalocean.app`

### Step 8: Seed Production Database

After deployment, seed your MongoDB Atlas database with initial data:

**Option A: Via DigitalOcean Console**

1. Go to your app in DigitalOcean dashboard
2. Click **Console** tab
3. Run:
   ```bash
   cd backend
   npm run seed
   ```

**Option B: From Your Local Machine**

```bash
cd backend
export MONGODB_URI="mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/gcobscura"
npm run seed
```

**Verify seeding worked:**
- Visit `https://your-app.ondigitalocean.app/api/places`
- Should return JSON with places data

---

## Using app.yaml (Optional)

Instead of configuring via the dashboard, you can use the `.do/app.yaml` file for version-controlled configuration:

1. Update `.do/app.yaml` with your GitHub repo name
2. When creating the app, select **"Use app.yaml"** option
3. DigitalOcean will read configuration from the file

**Note**: You still need to set `MONGODB_URI` as a secret environment variable in the dashboard (don't commit secrets to YAML).

---

## Updating Your App

With GitHub integration enabled, updates are automatic:

```bash
# Make changes locally
git add .
git commit -m "Update site content"
git push origin main

# DigitalOcean automatically:
# 1. Detects the push
# 2. Builds the app
# 3. Deploys the new version
# 4. Routes traffic to new deployment
```

You can monitor deployments in the DigitalOcean dashboard under **Deployments**.

---

## Custom Domain (Optional)

To use your own domain:

1. Go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `gcobscura.com`)
4. Add DNS records as instructed:
   - **CNAME**: `www` → `gcobscura-xxxxx.ondigitalocean.app`
   - **A Record**: `@` → (provided IP address)
5. DigitalOcean automatically provisions SSL certificate (Let's Encrypt)

---

## Monitoring and Logs

### View Logs

1. Go to your app in DigitalOcean dashboard
2. Click **Runtime Logs** tab
3. View real-time application logs

### Health Checks

DigitalOcean automatically monitors `/api/health` endpoint. If it fails:
- Check MongoDB connection
- Verify environment variables are set correctly
- Check runtime logs for errors

### Metrics

View app performance metrics:
- CPU usage
- Memory usage
- Request count
- Response times

---

## Troubleshooting

### Build Fails

**Error**: `npm install` fails
- **Solution**: Check Node.js version compatibility. DigitalOcean uses Node.js 18+ by default.

**Error**: `ng build` fails
- **Solution**: Check Angular build errors in build logs. Common issues:
  - Missing environment variables
  - TypeScript compilation errors
  - Missing dependencies

### App Won't Start

**Error**: `Cannot find module 'mongodb'`
- **Solution**: Ensure backend `npm install` runs in build command

**Error**: `MongoDB connection failed`
- **Solution**: 
  - Verify `MONGODB_URI` is set correctly
  - Check MongoDB Atlas network access (whitelist DigitalOcean IPs or use `0.0.0.0/0`)
  - Verify database user has correct permissions

### Angular Routes Return 404

**Error**: Navigating to `/places` returns 404
- **Solution**: Verify SPA fallback route is configured in `backend/src/server.ts`. The `app.get('*', ...)` route must be last.

### Static Files Not Loading

**Error**: CSS/JS files return 404
- **Solution**: 
  - Verify Angular build output directory: `frontend/dist/frontend/browser`
  - Check that `express.static()` middleware is configured correctly
  - Verify `NODE_ENV=production` is set

---

## Cost Breakdown

**DigitalOcean App Platform:**
- Basic-XXS: **$5/month** (512 MB RAM, 1 vCPU)
- Includes: SSL, CDN, auto-scaling, monitoring, logs

**MongoDB Atlas:**
- Free M0 cluster: **$0/month** (512 MB storage)

**Total**: ~$5/month

---

## Scaling

As your app grows:

1. **Vertical Scaling**: Upgrade to larger instance (Basic-XS, Basic-S, etc.)
2. **Horizontal Scaling**: Increase instance count (App Platform handles load balancing)
3. **Database**: Upgrade MongoDB Atlas plan if needed

---

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **MongoDB**: Use strong passwords, limit network access
3. **HTTPS**: DigitalOcean provides SSL automatically
4. **CORS**: Already configured in Express (allows all origins - tighten if needed)

---

## Next Steps

After deployment:

1. ✅ Test all API endpoints
2. ✅ Verify Angular routes work
3. ✅ Test booking submission
4. ✅ Set up custom domain (optional)
5. ✅ Configure monitoring alerts
6. ✅ Set up backup strategy for MongoDB

---

## Support Resources

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Docs](https://expressjs.com/)
- [Angular Docs](https://angular.dev/)

