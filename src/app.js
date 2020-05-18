const express = require('express');
const cors = require('cors');
const path = require('path');
const tasks = require('./routes/tasks')

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  allowedHeaders: ['sessionId', 'Content-Type'],
  exposedHeader: ['sessionId'],
  origin: ['http://localhost:3000']
}));

app.use(express.urlencoded());
app.use(express.json());

app.use('/api/tasks/', tasks)

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});
