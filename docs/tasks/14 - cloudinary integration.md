# Use photos from Cloudinary

INstead of using photos in the photos folder, as before, change the image component to link to photos in my CLoudinary account's storage. Links to photos are in the form:

CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@gcunhistorical

where the api key and secret are stored in the frontend environment settings.

## Cloudinary docs
Use the docs at /docs/cloudinary.md to understand how CLoudinary image linking works. Keep the same responsive image srcset attribute, and each place's image id in Cloudinary will correspond to its id in the database. For example, 