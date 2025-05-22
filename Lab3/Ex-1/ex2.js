// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded form data (needed for POST requests)
app.use(express.urlencoded({ extended: true }));

// GET home page
app.get('/', (req, res) => {
  console.log(`Received GET request for /`);
  res.type('text/plain');
  res.send('Welcome to the Home Page');
});

// GET contact form
app.get('/contact', (req, res) => {
  console.log(`Received GET request for /contact`);
  res.type('html').send(`
    <form method="POST" action="/contact">
      <input type="text" name="name" placeholder="Your name" />
      <button type="submit">Submit</button>
    </form>
  `);
});

// POST form submission
app.post('/contact', (req, res) => {
  console.log(`Received POST request for /contact`);
  const name = req.body.name;

  fs.appendFile('submissions.txt', `${name}\n`, (err) => {
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).type('text/plain').send('Error saving data');
    }
    res.type('text/plain').send('Thank you for submitting your name!');
  });
});

// Handle 404 for other routes
app.use((req, res) => {
  console.log(`Received ${req.method} request for ${req.url} - Not Found`);
  res.status(404).type('text/plain').send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
