# New web app idea

## Overview
I want to make a web app to show interesting places and sights of a somewhat historical nature on Queensland's Gold Coast, especially around Surfers Paradise. As well as being a catalog of interesting sights/places, the site should function as the home page of a (proposed) 'Gold Coast Unhistorical Walking Tours' business, offering people the chance to take a one-hour walking tour which will cover many of the site's listed places.

The site should have a home page advertising the walking tour, as well as a list of places, each one of which will have its own addressable web page, with photos, a map, and some text about the place.

Maps will be a big part of the site, so each place page will have its own Google Map embedded, and there will be an interactive map om the home page too.

## Context
Even though The Gold Coast is not very interesting in the normal, traditional sense when it comes to history, there are plenty of more modern aspects to it that have interesting, quirky locations one can visit.

## Technical considerations
* The web stack will be the latest stable version of Angular nt he front end, and NodeJS in the back-end.
* Typescript will be used in both front-end and back-end
* No third-party CSS libraries are necessary, other than the LESS CSS preprocessor
* Layout will be done using CSS Flexbox and CSS Grid    
* Each place should have its own web address, along the lines of /places/{id}/{slug}
* Use Google Maps to embed any maps
* Data will come from a top-level Data folder in the server layer, with JSON files, such as places.json replacing traditional relational tables
* The front-end will interact with the back-end using a traditional API system. No authentication is required for now.