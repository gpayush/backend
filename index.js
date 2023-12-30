import express from 'express';
import {connect} from './db.js'
import cors from 'cors';
const app = express();
const port = 3002;

const corsOptions = {
  origin: 'https://6590286b9d7cd172b98d50b4--sensational-concha-ed7566.netlify.app',
};

app.use(cors(corsOptions));


// Define a simple route
app.get('/hello', (req, res) => {
  res.json({message: 'Hello, Express!'});
});

app.get('/hello2', (req, res) => {
    res.send('Hello2, Express!');
  });

  connect();
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
