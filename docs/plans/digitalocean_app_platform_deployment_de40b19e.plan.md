---
name: DigitalOcean App Platform Deployment
overview: Deploy Express backend + Angular frontend to DigitalOcean App Platform. Modify backend to serve Angular static files in production, create app.yaml configuration, and set up environment variables for MongoDB Atlas.
todos:
  - id: do-1
    content: Modify backend/src/server.ts to serve Angular static files in production mode
    status: pending
  - id: do-2
    content: Create .do/app.yaml configuration file for DigitalOcean App Platform
    status: pending
  - id: do-3
    content: Update README.md with DigitalOcean deployment instructions
    status: pending
  - id: do-4
    content: Test production build locally (build frontend + backend, verify static serving works)
    status: pending
    dependencies:
      - do-1
  - id: do-5
    content: Create deployment guide document with dashboard configuration steps
    status: pending
---

# Digit

alOcean App Platform Deployment Plan

## Architecture Overview

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

- DigitalOcean App Platform handles infrastructure, scaling, and SSL

- MongoDB Atlas hosted separately (already set up)

- Your Express code works as-is (no serverless conversion needed)

---

## Implementation Steps

### 1. Modify Backend to Serve Angular Static Files

**File**: `backend/src/server.ts`

Add static file serving in production mode. This allows Express to serve the built Angular app.**Changes needed:**

- Import `path` module

- Add static file middleware after API routes

- Add SPA fallback route for Angular routing

**Code to add** (after API routes, before `app.listen()`):

```typescript
import * as path from 'path';

// Serve Angular frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist', 'frontend', 'browser');
  app.use(express.static(frontendPath));
  
  // Handle Angular routes (SPA fallback - must be last route)
  app.get('*', (req: Request, res: Response) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}
```



### 2. Create DigitalOcean App Platform Configuration

**File**: `.do/app.yaml` (or configure via dashboard)

DigitalOcean App Platform can use an `app.yaml` file for configuration, or you can configure everything via the dashboard. The YAML approach is better for version control.

**Create `.do/app.yaml`**:

```yaml
name: gcobscura
region: sfo  # Choose closest to your users
services:
    - name: gcobscura-api
    github:
      repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
      branch: main
      deploy_on_push: true
    source_dir: /
    build_command: |
      cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
    run_command: cd backend && npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs  # $5/month - smallest option
    http_port: 3000
    health_check:
      http_path: /api/health
    envs:
            - key: NODE_ENV
        value: production
            - key: MONGODB_URI
        scope: RUN_TIME
        type: SECRET  # Set via dashboard
            - key: MONGODB_DB_NAME
        value: gcobscura
            - key: PORT
        value: "3000"
```



**Note**: DigitalOcean App Platform will auto-detect Node.js, but explicit configuration gives more control.

### 3. Update Build Process

**Current build flow:**

1. Build Angular frontend → `frontend/dist/frontend/browser/`

2. Build backend TypeScript → `backend/dist/`

3. Start Express server → serves API + static files

**Build command** (for App Platform):

```bash
cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
```

**Start command**:

```bash
cd backend && npm start
```



### 4. Environment Variables Setup

**Required in DigitalOcean Dashboard:**

- `NODE_ENV` = `production`

- `MONGODB_URI` = `mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/gcobscura` (set as SECRET)

- `MONGODB_DB_NAME` = `gcobscura` (optional, defaults to 'gcobscura')

- `PORT` = `3000` (App Platform sets this automatically, but explicit is fine)

### 5. Verify Backend Port Configuration

Your `backend/src/server.ts` already uses:

```typescript
const PORT = process.env.PORT || 3000;
```



This is perfect - App Platform sets `PORT` automatically.---

## Deployment Steps (Dashboard Method)

### Step 1: Prepare Code

1. Ensure all changes are committed and pushed to GitHub

2. Verify `backend/src/server.ts` includes static file serving code

3. Test build locally: `cd frontend && npm run build && cd ../backend && npm run build`

### Step 2: Create App in DigitalOcean

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)

2. Click **Create App**

3. Connect your GitHub repository

4. Select the repository and branch

### Step 3: Configure App

1. **App Type**: App Platform should auto-detect Node.js

2. **Root Directory**: `/` (root of repo)
3. **Build Command**: 
   ```javascript
      cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
   ```


4. **Run Command**: 

   ```javascript
      cd backend && npm start
   ```

5. **HTTP Port**: `3000`

6. **HTTP Request Routes**: `/` (default)

### Step 4: Set Environment Variables

In the App Platform dashboard:

1. Go to **Settings** → **App-Level Environment Variables**
2. Add:

- `NODE_ENV` = `production`

- `MONGODB_URI` = (your Atlas connection string - mark as SECRET)

- `MONGODB_DB_NAME` = `gcobscura`

- `PORT` = `3000` (optional, App Platform sets this)

### Step 5: Configure Health Check

1. Go to **Settings** → **Health Checks**

2. **HTTP Path**: `/api/health`

3. **Initial Delay**: `30` seconds

4. **Period**: `10` seconds

5. **Timeout**: `5` seconds
6. **Success Threshold**: `1`

7. **Failure Threshold**: `3`

### Step 6: Choose Plan

- **Basic Plan**: $5/month (512 MB RAM, 1 vCPU) - good for starting

- **Professional Plan**: $12/month (1 GB RAM, 1 vCPU) - if you need more resources

### Step 7: Deploy

1. Review configuration

2. Click **Create Resources**

3. Wait for build and deployment (5-10 minutes)

4. Your app will be live at: `https://gcobscura-xxxxx.ondigitalocean.app`

### Step 8: Seed Production Database

After deployment, seed your MongoDB Atlas database:

**Option A: From your local machine**

```bash
cd backend
export MONGODB_URI="mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/gcobscura"
npm run seed
```



**Option B: Via App Platform Console**

1. Go to your app in DigitalOcean dashboard
2. Click **Console** tab
3. Run: `cd backend && npm run seed`

---

## Files to Create/Modify

| File | Action | Purpose |

|------|--------|---------|

| `backend/src/server.ts` | Modify | Add static file serving for Angular in production |

| `.do/app.yaml` | Create | DigitalOcean App Platform configuration (optional) |

| `README.md` | Update | Add DigitalOcean deployment instructions |---

## Testing Checklist

- [ ] Backend serves Angular static files in production mode

- [ ] API endpoints work correctly (`/api/places`, `/api/places/:id`, `/api/tourists`, `/api/health`)

- [ ] Angular routes work (SPA fallback)

- [ ] MongoDB connection works in production

- [ ] Health check endpoint responds correctly

- [ ] Build completes successfully on App Platform

- [ ] Production database seeded

---

## Cost Estimate

**DigitalOcean App Platform:**

- Basic Plan: **$5/month** (512 MB RAM, 1 vCPU)

- Includes: SSL, CDN, auto-scaling, monitoring

- Free tier: None (unlike Render)

**MongoDB Atlas:**

- Free M0 cluster: **$0/month** (512 MB storage)

**Total**: ~$5/month---

## Advantages of DigitalOcean App Platform

✅ **Familiar platform** - You already use it

✅ **Express support** - No code changes needed (just static file serving)

✅ **Managed infrastructure** - SSL, CDN, scaling handled automatically

✅ **Git integration** - Auto-deploy on push

✅ **Health checks** - Automatic monitoring

✅ **Logs** - Built-in logging dashboard

✅ **Rollbacks** - Easy to revert deployments

---

## Next Steps

Once you approve this plan, I'll:

1. Modify `backend/src/server.ts` to serve Angular static files

2. Create `.do/app.yaml` configuration file (optional, for version control)

3. Update README with DigitalOcean deployment instructions

4. Test the production build locally