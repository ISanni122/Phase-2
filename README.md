In Phase 2,Created a data structure based on the TMDB 5000 Movies dataset and stored data in a local JSON file
Set up an Express.js server (server.js) with modular structure.
Implemented a shared file utility module (shared/file-utils.js) that handles reading JSON data from file and writing updates back to the file
Created movieModel.js to handle all CRUD logic
Created movieRoutes.js with independent Express Router
Used express-validator in movieValidation.js to validate POST/PUT requests
All routes now read and write directly to movies.json
All responses follow RESTful conventions
Group Members: Ibrahim Sanni
