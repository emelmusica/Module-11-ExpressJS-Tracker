// Import required packages and modules
const express = require('express'); // Express.js framework
const fs = require('fs'); // File system module
const path = require('path'); // Path module
const { v4: uuidv4 } = require('uuid'); // Use the uuid package to generate unique ids

// Create an instance of the Express application
const app = express();

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

// API routes
// Handle GET requests to '/api/notes'
app.get('/api/notes', (req, res) => {
  // Read the contents of 'db.json' file and send the notes as a JSON response
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Handle POST requests to '/api/notes'
app.post('/api/notes', (req, res) => {
  // Extract title and text from the request body
  const { title, text } = req.body;
  
  // Check if both title and text are provided, otherwise send an error response
  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required fields.' });
  }

  // Read the contents of 'db.json' file
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    
    // Create a new note with a unique ID using uuid package
    const newNote = {
      id: uuidv4(),
      title,
      text,
    };
    
    // Add the new note to the existing notes
    notes.push(newNote);

    // Write the updated notes array back to 'db.json' file
    fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// HTML routes
// Handle GET requests to '/notes'
app.get('/notes', (req, res) => {
  // Serve the 'notes.html' file
  res.sendFile(path.join(__dirname, 'notes.html'));
});

// Handle all other GET requests (catch-all route)
app.get('*', (req, res) => {
  // Serve the 'index.html' file located in the 'Develop/public' directory
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
