import express, { Request, Response } from 'express';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import { Db } from 'mongodb';
import { connectToMongo } from './db/mongo';
import { getPlaceById, getPlaces } from './repositories/places.repo';
import { createBooking, validateCreateBookingInput } from './repositories/bookings.repo';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

let db: Db;

// API endpoint to get all places
app.get('/api/places', async (req: Request, res: Response) => {
  try {
    // Fetch places from MongoDB
    const places = await getPlaces(db);
    res.json(places);
  } catch (error: unknown) {
    console.error('Error loading places:', error);
    res.status(500).json({ error: 'Failed to load places data' });
  }
});

// API endpoint to get a single place by ID
app.get('/api/places/:id', (req: Request, res: Response) => {
  getPlaceById(db, req.params.id)
    .then((place) => {
      if (!place) return res.status(404).json({ error: 'Place not found' });
      return res.json(place);
    })
    .catch((error: unknown) => {
      console.error('Error loading place:', error);
      res.status(500).json({ error: 'Failed to load place data' });
    });
});

// API endpoint to submit a tour booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const validation = validateCreateBookingInput(req.body);
  if (!validation.ok) return res.status(400).json({ error: validation.error });

  createBooking(db, validation.value)
    .then((booking) => res.status(201).json(booking))
    .catch((error: unknown) => {
      console.error('Error saving booking:', error);
      res.status(500).json({ error: 'Failed to save booking' });
    });
});

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await db.command({ ping: 1 });
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error: unknown) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error' });
  }
});

// Debug endpoint to check file paths (helps diagnose static file serving issues)
app.get('/api/debug/paths', (req: Request, res: Response) => {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist', 'frontend', 'browser');
  const photosPath = path.join(frontendPath, 'photos');
  
  // Check if directories exist
  const frontendExists = fs.existsSync(frontendPath);
  const photosExists = fs.existsSync(photosPath);
  
  // List contents of photos directory if it exists
  let photosContents: string[] = [];
  if (photosExists) {
    try {
      photosContents = fs.readdirSync(photosPath);
    } catch (err) {
      photosContents = [`Error reading directory: ${err}`];
    }
  }
  
  res.json({
    __dirname,
    cwd: process.cwd(),
    NODE_ENV: process.env.NODE_ENV,
    frontendPath,
    frontendExists,
    photosPath,
    photosExists,
    photosContents: photosContents.slice(0, 10), // First 10 items only
    frontendContents: frontendExists ? fs.readdirSync(frontendPath).slice(0, 10) : []
  });
});

// Development mode: helpful message for root route
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Express API Server',
      status: 'running',
      apiEndpoints: [
        'GET /api/places - Get all places',
        'GET /api/places/:id - Get a single place',
        'POST /api/bookings - Submit a booking',
        'GET /api/health - Health check'
      ],
      frontend: 'Angular dev server runs on http://localhost:4200',
      note: 'In production, this server also serves the Angular frontend'
    });
  });
}

// Serve Angular frontend in production
// This allows Express to serve the built Angular app as static files
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist', 'frontend', 'browser');
  
  // Log the resolved path for debugging
  console.log('Static files path:', frontendPath);
  console.log('Static files path exists:', fs.existsSync(frontendPath));
  console.log('Photos path exists:', fs.existsSync(path.join(frontendPath, 'photos')));
  
  app.use(express.static(frontendPath));

  // Handle Angular routes (SPA fallback - must be last route)
  // This ensures Angular routing works when users navigate directly to routes like /places
  app.get('*', (req: Request, res: Response) => {
    // Don't serve index.html for API routes (should have been caught above)
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Don't serve index.html for file requests (images, assets, etc.)
    // If express.static() couldn't find the file and it has an extension, return 404
    // This prevents serving index.html for missing static assets
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(req.path);
    if (hasFileExtension) {
      // express.static() already tried to serve this file and couldn't find it
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Serve index.html for Angular routes
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

async function start(): Promise<void> {
  db = await connectToMongo();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode.`);
  });
}

start().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});

