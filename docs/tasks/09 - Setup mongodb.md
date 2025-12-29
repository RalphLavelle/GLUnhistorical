# Set up MongoDB

Because of the data requirements of this app, pecifically the places and tourists data, I'll need MongoDB set up to handle that data.

## Update the back-end
Change the backend to use MongoDB (running locally when the app is on localhost, but capable of switching to a hosted MongoDB instance), move the two data JSON files into the MongoDB, maybe as a set-up script that can be run once, then delete those two JSON files.

## Env file
Make sure nothing sensitive is saved into a file that is either exposed publicly or can be checked into git.