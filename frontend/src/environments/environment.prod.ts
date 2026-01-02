/**
 * Production environment configuration
 * 
 * This file is committed to Git. Google Maps API keys are public by design
 * and are secured via domain restrictions in Google Cloud Console.
 */
export const environment = {
  production: true,
  apiUrl: '/api',
  cloudinary: {
    // Cloud name is used for public image delivery URLs
    cloudName: 'gcunhistorical',
    // API key and secret for administrative operations (not used in frontend)
    apiKey: "673151474263497",
    secret: "_OrVYw-tSiUgnhEl7fOuqwf63F8"
  },
  googleMapsApiKey: 'AIzaSyASdZVUdz2A1sFLWczr3tma390lWiXGHJo'  // Your Google Maps API key
};

