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
const dataPath = path.join(__dirname, '../../data');

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

// API endpoint to submit a tour booking
app.post('/api/tourists', (req: Request, res: Response) => {
  try {
    const touristData = req.body;
    
    // Validate required fields
    if (!touristData.name || !touristData.email || !touristData.partySize || !touristData.preferredDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique ID and timestamp
    const booking: any = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: touristData.name,
      email: touristData.email,
      partySize: parseInt(touristData.partySize, 10),
      preferredDate: touristData.preferredDate,
      createdAt: new Date().toISOString()
    };

    // Read existing bookings or initialize empty array
    const touristsFilePath = path.join(dataPath, 'tourists.json');
    let tourists: any[] = [];
    
    if (fs.existsSync(touristsFilePath)) {
      const existingData = fs.readFileSync(touristsFilePath, 'utf-8');
      tourists = JSON.parse(existingData);
    }

    // Add new booking
    tourists.push(booking);

    // Write back to file
    fs.writeFileSync(touristsFilePath, JSON.stringify(tourists, null, 2), 'utf-8');

    // Return the created booking
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error saving tourist booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

