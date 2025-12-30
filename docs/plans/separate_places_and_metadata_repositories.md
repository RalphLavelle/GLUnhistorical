---
name: Separate Places and Metadata Repositories
overview: Refactor the backend to separate the places repository from metadata. Create a new metadata repository that reads from metadata.json file, clean up the places repository to only handle MongoDB places collection, and update the API response to combine both sources.
todos: []
---

# Backend Repository Refactor Plan

## Overview

Separate the places repository from metadata functionality. Metadata will be read from a JSON file (`backend/src/db/metadata.json`), while places will continue to be stored in MongoDB. The API will combine both sources when returning a `PlacesResponse`.

## Current State Analysis

### Issues Identified

1. **`places.repo.ts`** contains commented-out metadata code that should be removed
2. **`getPlacesResponse()`** only returns places, but frontend expects metadata in the response
3. **`upsertPlacesAndMetadata()`** function name and structure mixes concerns
4. **Frontend** uses `data.metadata.coordinates` in `home.ts` for map centering

### Files to Modify

- `backend/src/repositories/places.repo.ts` - Remove metadata code, rename functions
- `backend/src/repositories/metadata.repo.ts` - **NEW FILE** - Read metadata from JSON file
- `backend/src/types/api.ts` - Uncomment and update `PlacesMetadata` interface
- `backend/src/server.ts` - Update `getPlacesResponse` call to combine places + metadata

## Implementation Steps

### 1. Create Metadata Repository

**File:** `backend/src/repositories/metadata.repo.ts` (NEW)

- Create `getMetadata()` function that:
  - Reads `backend/src/db/metadata.json` file synchronously
  - Parses JSON and returns `PlacesMetadata` type
  - Handles file path resolution for both dev and production builds
  - Adds error handling for missing file
- Use `fs` and `path` modules
- Path resolution: `path.join(__dirname, '..', 'db', 'metadata.json')`

### 2. Update Type Definitions

**File:** `backend/src/types/api.ts`

- Uncomment `PlacesMetadata` interface (lines 20-31)
- Uncomment metadata in `PlacesResponse` interface (line 35)
- Ensure structure matches `metadata.json` file:
  - `version`, `lastUpdated`, `tourDuration`, `tourDistance`, `region`, `coordinates`
  - Note: `totalPlaces` should be computed from places array, not stored

### 3. Clean Up Places Repository

**File:** `backend/src/repositories/places.repo.ts`

- Remove all commented-out metadata code:
  - Remove `METADATA_COLLECTION` constant (line 6)
  - Remove `METADATA_ID` constant (line 7)
  - Remove `PlacesMetadataDoc` type (line 9)
  - Remove `getMetadataCollection()` function (lines 15-17)
- Remove metadata-related comments from `getPlacesResponse()` (lines 28, 31-36, 38)
- Rename `upsertPlacesAndMetadata()` to `upsertPlaces()`:
  - Remove metadata parameter handling
  - Update return type to only `{ placesUpserted: number }`
  - Remove commented metadata upsert code (lines 60-64)
- Update function to only handle places array from input
- Verify `getPlaceById()` is correctly implemented (line 43)

### 4. Update API Response Handler

**File:** `backend/src/server.ts`

- Modify `/api/places` endpoint (line 19-26):
  - Import `getMetadata` from metadata repository
  - Call both `getPlacesResponse(db)` and `getMetadata()` in parallel
  - Combine results: `{ places: [...], metadata: {...} }`
  - Add `totalPlaces` to metadata (computed from places array length)
  - Handle errors from both sources appropriately

### 5. Verify Places Data Structure

**File:** `backend/src/repositories/places.repo.ts`

- Ensure `Place` interface matches MongoDB document structure
- Verify `getPlaceById()` uses correct query field (`id`)
- Confirm `upsertPlaces()` correctly handles the `id` field for upserts

## Data Flow

```mermaid
graph TD
    A[API Request /api/places] --> B[getPlacesResponse]
    A --> C[getMetadata]
    B --> D[MongoDB places collection]
    C --> E[metadata.json file]
    D --> F[Place[]]
    E --> G[PlacesMetadata]
    F --> H[Combine Response]
    G --> H
    H --> I[PlacesResponse with places + metadata]
```

## Testing Considerations

1. Verify `/api/places` returns both places and metadata
2. Ensure metadata includes `totalPlaces` computed from places array
3. Test error handling when metadata.json is missing
4. Confirm frontend map centering still works with metadata coordinates

## Notes

- Metadata is static configuration data, so file-based storage is appropriate
- Places are dynamic data, so MongoDB storage is correct
- The `totalPlaces` field in metadata should be computed dynamically, not stored
- Path resolution must work in both development and production builds

