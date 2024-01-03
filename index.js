import express from 'express';
import {connect} from './db.js'
import cors from 'cors';
import bodyParser from 'body-parser';
import {router as authRouter} from './routes/authRoute.js'
import cookieParser from 'cookie-parser';
const app = express();
const port = 3002;


const corsOptions = {
  origin: 'https://parkeme.netlify.app',
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());


//routes import


app.use("/api/user", authRouter);
// Define a simple route
app.get('/', (req, res) => {
  res.json({message: 'Hello, home!'});
});
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
