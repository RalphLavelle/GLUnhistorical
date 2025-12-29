import express, { Request, Response } from 'express';
import cors from 'cors';
import { Db } from 'mongodb';
import { connectToMongo } from './db/mongo';
import { getPlaceById, getPlacesResponse } from './repositories/places.repo';
import { createBooking, validateCreateBookingInput } from './repositories/tourists.repo';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

let db: Db;

// API endpoint to get all places
app.get('/api/places', (req: Request, res: Response) => {
  getPlacesResponse(db)
    .then((data) => res.json(data))
    .catch((error: unknown) => {
      console.error('Error loading places:', error);
      res.status(500).json({ error: 'Failed to load places data' });
    });
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
app.post('/api/tourists', (req: Request, res: Response) => {
  const validation = validateCreateBookingInput(req.body);
  if (!validation.ok) return res.status(400).json({ error: validation.error });

  createBooking(db, validation.value)
    .then((booking) => res.status(201).json(booking))
    .catch((error: unknown) => {
      console.error('Error saving tourist booking:', error);
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

async function start(): Promise<void> {
  db = await connectToMongo();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});

