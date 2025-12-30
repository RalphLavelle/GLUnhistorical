# Backend refactor
Redo the backend Mongo repos to separate the places repo from metadata, with which it has nothing in common. Use a separate repo to get the metadata now from the metadata.json file.

The structure of the places data may have changed, so make sure the places repo is getting it correctly from the places collection in the Mongo db.