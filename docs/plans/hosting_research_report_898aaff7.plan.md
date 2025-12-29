---
name: Hosting Research Report
overview: Research report comparing hosting options for an Angular + Node.js + MongoDB Atlas site, with detailed deployment instructions for the recommended provider (Render.com).
todos:
  - id: host-1
    content: Modify backend/src/server.ts to serve Angular static files in production
    status: pending
  - id: host-2
    content: Create render.yaml deployment configuration
    status: pending
    dependencies:
      - host-1
  - id: host-3
    content: Test production build locally before deploying
    status: pending
    dependencies:
      - host-2
  - id: host-4
    content: Deploy to Render and seed production MongoDB
    status: pending
    dependencies:
      - host-3
---

# Hosting Options Research Report

## Your Architecture (Post-MongoDB Migration)

```mermaid
flowchart LR
    subgraph cloud [Cloud Hosting]
        FE[Angular Frontend<br/>Static Assets + Photos]
        BE[Node.js Backend<br/>Express API]
    end
    subgraph atlas [MongoDB Atlas]
        DB[(MongoDB<br/>Free M0 Cluster)]
    end
    User --> FE
    FE --> BE
    BE --> DB
```

**Key insight**: Your photos are **static assets** bundled into the Angular build (`frontend/dist/`), not user-uploaded files. This means you do NOT need persistent disk storage - any host that can serve your built app will work.---

## Recommended Option: Render.com (Single App)

**Why Render?**

- Free tier available (750 hours/month)
- Git-based auto-deploy (push to deploy)
- Serves both Node backend AND Angular static files
- Free SSL, custom domains when ready
- Simple setup (no Docker required)

**Limitations**:

- Free tier spins down after 15 min inactivity (cold start ~30-50s on first request)
- 512 MB RAM on free tier

**Cost**: Free (or $7/month for always-on "Starter" tier)---

## Alternative Options

| Platform | Free Tier | Pros | Cons |

|----------|-----------|------|------|

| **Fly.io** | 3 shared VMs free | Fast cold starts, global regions | Requires Dockerfile |

| **Railway** | $5 credit/month | Easy setup, good DX | Credit runs out with traffic |

| **Vercel + Render** | Both have free tiers | Best static performance (CDN) | Two deployments to manage |

| **DigitalOcean App Platform** | $0 for static, $5/mo for services | Reliable, good UI | No true free tier for backend |---

## Deployment Instructions: Render.com

### Prerequisites

1. GitHub account (Render deploys from Git)
2. MongoDB Atlas account with free M0 cluster ([atlas.mongodb.com](https://atlas.mongodb.com))
3. Your Atlas connection string: `mongodb+srv://USER:PASS@cluster.xxxxx.mongodb.net/gcobscura`

### Step 1: Prepare Your Backend to Serve Angular

Modify `backend/src/server.ts` to serve the Angular build in production. Add this **after** your API routes but **before** `app.listen()`:

```typescript
// Serve Angular frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist', 'frontend', 'browser');
  app.use(express.static(frontendPath));
  
  // Handle Angular routes (SPA fallback)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}
```



### Step 2: Add Build Scripts for Render

Create `render.yaml` in your project root:

```yaml
services:
    - type: web
    name: gcobscura
    env: node
    plan: free
    buildCommand: cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build && npm run seed
    startCommand: cd backend && npm start
    envVars:
            - key: NODE_ENV
        value: production
            - key: MONGODB_URI
        sync: false  # Set manually in Render dashboard
            - key: MONGODB_DB_NAME
        value: gcobscura
```



### Step 3: Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```



### Step 4: Create Render Web Service

1. Go to [render.com](https://render.com) and sign up/login
2. Click **New** > **Web Service**
3. Connect your GitHub repo
4. Configure:

- **Name**: `gcobscura`
- **Region**: Choose closest to Australia (Singapore)
- **Branch**: `main`
- **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`

5. Add Environment Variables:

- `NODE_ENV` = `production`
- `MONGODB_URI` = `mongodb+srv://YOUR_USER:YOUR_PASS@cluster.xxxxx.mongodb.net/gcobscura`
- `MONGODB_DB_NAME` = `gcobscura`

6. Click **Create Web Service**

### Step 5: Seed Your Production Database

After first deploy, run the seed script once via Render Shell:

1. Go to your service in Render dashboard
2. Click **Shell** tab
3. Run: `cd backend && npm run seed`

### Step 6: Verify Deployment

Your site will be live at: `https://gcobscura.onrender.com` (or similar)Test endpoints:

- `https://gcobscura.onrender.com/` (Angular app)
- `https://gcobscura.onrender.com/api/health` (API health check)
- `https://gcobscura.onrender.com/api/places` (Places data)

---

## Updating Your Site

With Render's Git integration, updates are automatic:

```bash
# Make changes locally
git add .
git commit -m "Update site content"
git push origin main
# Render automatically rebuilds and deploys
```

---

## MongoDB Atlas Setup (if not done)

1. Go to [atlas.mongodb.com](https://atlas.mongodb.com)
2. Create free account
3. Create new cluster (M0 Free tier)
4. **Database Access**: Create user with read/write permissions
5. **Network Access**: Add `0.0.0.0/0` (allow from anywhere) for simplicity
6. **Connect**: Get connection string, replace `<password>` with your DB user password

---

## Files to Create/Modify

| File | Action | Purpose |

|------|--------|---------|

| `backend/src/server.ts` | Modify | Add static file serving for production |

| `render.yaml` | Create | Render deployment config |

| `.gitignore` | Verify | Ensure `.env` files are ignored |---

## Next Steps (your choice)

1. **Proceed with Render setup** - I'll modify server.ts and create render.yaml
2. **Try a different host** - I can provide detailed instructions for Fly.io or Railway instead