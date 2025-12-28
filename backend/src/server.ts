import express, { Request, Response } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Serve static files from Data directory
const dataPath = path.join(__dirname, '../../Data');

// API endpoint to get all places
app.get('/api/places', (req: Request, res: Response) => {
  try {
    const placesData = fs.readFileSync(
      path.join(dataPath, 'places.json'),
      'utf-8'
    );
    const data = JSON.parse(placesData);
    res.json(data);
  } catch (error) {
    console.error('Error reading places.json:', error);
    res.status(500).json({ error: 'Failed to load places data' });
  }
});

// API endpoint to get a single place by ID
app.get('/api/places/:id', (req: Request, res: Response) => {
  try {
    const placesData = fs.readFileSync(
      path.join(dataPath, 'places.json'),
      'utf-8'
    );
    const data = JSON.parse(placesData);
    const place = data.places.find((p: { id: string }) => p.id === req.params.id);
    
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    console.error('Error reading places.json:', error);
    res.status(500).json({ error: 'Failed to load place data' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

