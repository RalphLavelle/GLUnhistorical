# Google Maps API Key Setup Guide

This guide explains how to securely configure your Google Maps API key using environment variables instead of hardcoding it in your HTML files.

## Security Issue Fixed

Previously, the Google Maps API key was hardcoded in `frontend/src/index.html`, which meant it was committed to Git and exposed publicly. This has been fixed by:

1. ✅ Moving the API key to environment variables
2. ✅ Loading Google Maps API dynamically via a service
3. ✅ Adding environment files to `.gitignore`
4. ✅ Removing the hardcoded key from `index.html`

---

## Local Development Setup

### Step 1: Create Environment Files

Copy the example environment file and add your API key:

**Windows (PowerShell):**
```powershell
cd frontend\src\environments
Copy-Item environment.example.ts environment.ts
Copy-Item environment.example.ts environment.prod.ts
```

**Linux/Mac:**
```bash
cd frontend/src/environments
cp environment.example.ts environment.ts
cp environment.example.ts environment.prod.ts
```

### Step 2: Add Your API Key

Edit `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: '/api',
  googleMapsApiKey: 'YOUR_ACTUAL_API_KEY_HERE'  // Replace this
};
```

**Important**: These files are in `.gitignore` and won't be committed to Git.

### Step 3: Verify It Works

```powershell
cd frontend
npm start
```

Visit `http://localhost:4200` and verify maps load correctly.

---

## Production Setup (DigitalOcean)

### Option 1: Environment Variable Replacement (Recommended)

DigitalOcean App Platform can replace environment variables at build time. However, Angular's build process doesn't directly support runtime environment variables for the build output.

**Best approach**: Use build-time replacement via Angular's environment files.

### Option 2: Set API Key in Environment File Before Build

1. **Before deploying**, update `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: '/api',
     googleMapsApiKey: 'YOUR_PRODUCTION_API_KEY'
   };
   ```

2. **Commit this file** (it will be in your build, but that's acceptable for Google Maps API keys - they're meant to be public in the frontend)

3. **Deploy** - The key will be baked into the production build

**Note**: Google Maps API keys are designed to be public in frontend code. The security comes from:
- **API restrictions** (domain restrictions, API restrictions)
- **Usage quotas** (set limits in Google Cloud Console)

### Option 3: Use DigitalOcean Build-Time Environment Variables

If you want to avoid committing the key:

1. **Set environment variable in DigitalOcean**:
   - Variable name: `GOOGLE_MAPS_API_KEY`
   - Scope: Build-time

2. **Modify build script** to inject the key:
   ```bash
   # In DigitalOcean build command, add:
   echo "export const environment = { production: true, apiUrl: '/api', googleMapsApiKey: '$GOOGLE_MAPS_API_KEY' };" > frontend/src/environments/environment.prod.ts
   ```

3. **Then build**:
   ```bash
   cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
   ```

---

## Securing Your API Key

Even though Google Maps API keys are public in frontend code, you should:

### 1. Set API Restrictions

In [Google Cloud Console](https://console.cloud.google.com/):

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     - `http://localhost:4200/*` (for local dev)
     - `https://your-app.ondigitalocean.app/*` (for production)
     - `https://yourdomain.com/*` (if using custom domain)

### 2. Set API Restrictions

Under **API restrictions**:
- Select **Restrict key**
- Choose only:
  - **Maps JavaScript API**
  - **Places API** (if using Places features)

### 3. Set Usage Quotas

1. Go to **APIs & Services** → **Dashboard**
2. Select **Maps JavaScript API**
3. Go to **Quotas** tab
4. Set reasonable limits to prevent abuse

---

## Removing the Exposed Key from Git History

If you've already committed the key to Git, you should:

### Option 1: Rotate the Key (Recommended - Easiest)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a **new API key**
3. Delete or restrict the old key
4. Update your environment files with the new key
5. The old key in Git history won't work anymore

### Option 2: Remove from Git History (Advanced)

**Warning**: This rewrites Git history. Only do this if:
- You haven't shared the repo with others, OR
- You coordinate with your team

```bash
# Remove the key from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch frontend/src/index.html" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (destructive!)
git push origin --force --all
```

**Better approach**: Just rotate the key (Option 1) - it's safer and easier.

---

## Verification Checklist

- [ ] Environment files created (`environment.ts` and `environment.prod.ts`)
- [ ] API key added to environment files
- [ ] `index.html` no longer contains hardcoded key
- [ ] Environment files are in `.gitignore`
- [ ] Maps work in local development
- [ ] API restrictions set in Google Cloud Console
- [ ] Old API key rotated/deleted (if it was exposed)

---

## Troubleshooting

### Maps Don't Load

**Error**: "Google Maps API key not configured"

**Solution**: 
1. Check `environment.ts` has your API key
2. Verify the key is correct (no extra spaces)
3. Check browser console for errors

### Maps Load But Show Errors

**Error**: "This API key is not authorized"

**Solution**:
1. Check API restrictions in Google Cloud Console
2. Verify your domain is whitelisted
3. Ensure Maps JavaScript API is enabled

### Production Build Missing Key

**Error**: Maps don't work in production

**Solution**:
1. Verify `environment.prod.ts` has the production API key
2. Check that `angular.json` has fileReplacements configured
3. Rebuild: `npm run build`

---

## Additional Resources

- [Google Maps API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Securing API Keys](https://developers.google.com/maps/api-security-best-practices)
- [API Key Restrictions](https://developers.google.com/maps/api-security-best-practices#restricting-api-keys)

