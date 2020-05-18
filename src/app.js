const express = require('express');
const cors = require('cors');
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

app.get('/', (req, res) => res.send('test'))
app.use('/api/tasks/', tasks)

app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});
