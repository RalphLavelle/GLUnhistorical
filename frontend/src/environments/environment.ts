/**
 * Example environment configuration file
 * 
 * Copy this file to environment.ts and environment.prod.ts
 * Replace YOUR_GOOGLE_MAPS_API_KEY with your actual Google Maps API key
 * 
 * IMPORTANT: Never commit environment.ts or environment.prod.ts with real API keys!
 */

export const environment = {
  production: false,  // Set to true in environment.prod.ts
  apiUrl: '/api',
  cloudinary: {
    // Cloud name is used for public image delivery URLs
    cloudName: 'gcunhistorical',
    // API key and secret for administrative operations (not used in frontend)
    apiKey: "673151474263497",
    secret: "_OrVYw-tSiUgnhEl7fOuqwf63F8"
  },
  googleMapsApiKey: 'AIzaSyASdZVUdz2A1sFLWczr3tma390lWiXGHJo'  // Replace with your actual key
};

