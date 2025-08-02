// server.js
const jsonServer = require('json-server');
const express = require('express');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const app = express();
const port = 5000;

app.use(middlewares);
app.use(express.json());

// Enable CORS for all routes so your React app can connect
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Use the JSON Server router
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
  console.log('Use "GET /articles" to view all articles.');
  console.log('Use "POST /articles" to create a new article.');
  console.log('Use "PUT /articles/:id" to update an article.');
  console.log('Use "DELETE /articles/:id" to delete an article.');
});
