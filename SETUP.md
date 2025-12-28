# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v20+ recommended)
- ✅ npm installed
- ✅ Google Maps API key

## Step-by-Step Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 3. Configure Google Maps API Key

Edit `frontend/src/index.html` and replace `YOUR_API_KEY` with your actual Google Maps API key:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

### 4. Start Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see: `Server is running on http://localhost:3000`

### 5. Start Frontend Server

Open a **new** terminal and run:
```bash
cd frontend
npm start
```

The app will open at `http://localhost:4200`

## Testing the Application

1. **Home Page**: Visit `http://localhost:4200` - You should see the tour information and a map
2. **Places List**: Visit `http://localhost:4200/places` - Browse all 25 places
3. **Place Detail**: Click any place to see its detail page with map

## Troubleshooting

### Maps Not Loading
- Verify your Google Maps API key is correct
- Check browser console for API key errors
- Ensure Maps JavaScript API is enabled in Google Cloud Console

### API Errors
- Ensure backend server is running on port 3000
- Check that `Data/places.json` exists and is valid JSON
- Verify proxy configuration in `frontend/proxy.conf.json`

### Port Already in Use
- Backend: Change port in `backend/src/server.ts` (default: 3000)
- Frontend: Use `ng serve --port 4201` to use a different port

## Development Tips

- Backend auto-reloads on file changes (using `ts-node-dev`)
- Frontend hot-reloads automatically (Angular dev server)
- Check browser console and terminal for error messages
- Use browser DevTools to inspect network requests

