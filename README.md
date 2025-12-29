# Gold Coast Unhistorical Walking Tours

A web application showcasing interesting and quirky places in Surfers Paradise, Queensland, Australia. The site functions as both a catalog of unique locations and the home page for the "Gold Coast Unhistorical Walking Tours" business.

## Features

- **Home Page**: Features walking tour information and an interactive Google Map showing all tour locations
- **Places List**: Browse all 25 places with search and category filtering
- **Place Detail Pages**: Individual pages for each place with photos, descriptions, and embedded Google Maps
- **Responsive Design**: Mobile-friendly layout using CSS Grid and Flexbox
- **Modern Angular**: Built with Angular 21 using standalone components and signals
- **Swappable colour palettes**: uncomment a theme in _themes.less to use it

## Tech Stack

### Frontend
- Angular 21 (latest stable)
- TypeScript
- LESS CSS preprocessor
- CSS Grid & Flexbox for layout
- Google Maps API integration

### Backend
- Node.js with Express
- TypeScript
- MongoDB (persistent storage for places + tour bookings)
- RESTful API endpoints

## Prerequisites

- Node.js (v20.19.0 or v22.12.0 or >=24.0.0 recommended)
- npm (v8.0.0 or higher)
- Google Maps API key ([Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key))

## Setup Instructions

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configure Google Maps API Key

**Important**: The API key is now stored in environment variables for security. See [docs/GOOGLE_MAPS_API_KEY_SETUP.md](docs/GOOGLE_MAPS_API_KEY_SETUP.md) for detailed instructions.

**Quick Setup:**

1. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
3. Create environment files:
   ```powershell
   cd frontend\src\environments
   Copy-Item environment.example.ts environment.ts
   ```
4. Edit `frontend/src/environments/environment.ts`:
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key

**Security Note**: If you previously committed your API key to Git, rotate it in Google Cloud Console and update your environment files with the new key.

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:3000`

**API Endpoints:**
- `GET /api/places` - Get all places
- `GET /api/places/:id` - Get a single place by ID
- `GET /api/health` - Health check

### 4. Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend application will be available at `http://localhost:4200`

The Angular dev server is configured with a proxy to forward API requests to the backend server, avoiding CORS issues during development.

## Project Structure

```
GCObscura/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   └── server.ts       # Express server and API routes
│   ├── data/               # Data files (places.json, tourists.json)
│   │   ├── places.json    # Places data (served by backend)
│   │   └── tourists.json  # Tour bookings data
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Angular components
│   │   │   ├── services/  # API services
│   │   │   ├── models/    # TypeScript interfaces
│   │   │   └── app.*      # Root app component
│   │   └── index.html
│   └── angular.json
└── README.md
```

## Development

### Backend Development

- **Build**: `npm run build`
- **Start**: `npm start`
- **Dev Mode**: `npm run dev` (with auto-reload)

### Frontend Development

- **Start Dev Server**: `npm start`
- **Build**: `npm run build`
- **Watch Mode**: `npm run watch`

## Routes

- `/` - Home page with tour information and interactive map
- `/places` - List of all places with search and filters
- `/places/:id/:slug` - Individual place detail page

## Deployment

### DigitalOcean App Platform

This application is configured for deployment on DigitalOcean App Platform. The Express backend serves both the API and the Angular frontend static files in production.

**Prerequisites:**
- DigitalOcean account
- MongoDB Atlas account (free M0 cluster)
- GitHub repository

**Quick Deploy:**

1. Push your code to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Click **Create App** and connect your GitHub repository
4. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build`
     - *Note: Uses `&&` (bash syntax) because DigitalOcean runs on Linux. For local PowerShell testing, use `.\scripts\build-production.ps1`*
   - **Run Command**: `cd backend && npm start`
   - **HTTP Port**: `3000`
5. Set environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `MONGODB_DB_NAME` = `gcobscura`
6. Deploy and seed database: `cd backend && npm run seed`

**Local Testing (PowerShell):**
```powershell
# Test production build locally
.\scripts\build-production.ps1

# Or manually:
cd frontend; npm install; npm run build
cd ..\backend; npm install; npm run build
```

For detailed deployment instructions, see [docs/DIGITALOCEAN_DEPLOYMENT.md](docs/DIGITALOCEAN_DEPLOYMENT.md)

## Data Format

Places data has the following structure:

```json
{
  "places": [
    {
      "id": "unique-id",
      "name": "Place Name",
      "description": "Description text...",
      "photo": "URL to photo",
      "latitude": -28.00200,
      "longitude": 153.42900,
      "category": "landmark",
      "address": "Street address"
    }
  ],
  "metadata": {
    "version": "1.0",
    "totalPlaces": 25,
    "tourDuration": "60-90 minutes",
    "tourDistance": "3-4 kilometres"
  }
}
```

## Environment Configuration

For production deployment, you may want to:

1. Create environment files for different environments (dev, test, prod)
2. Store the Google Maps API key in environment variables
3. Configure API base URLs per environment

## Notes

- The backend uses MongoDB for persistence.
- The JSON files in `backend/data` are kept as **seed/backup data**, and can be imported into MongoDB using `npm run seed` from the `backend` directory.
- No authentication is required for the API endpoints
- Google Maps requires a valid API key to function
- The application uses lazy loading for routes to optimize performance

