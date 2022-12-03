const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require("cors");
const asyncHandler = require('express-async-handler');
const api = require('./api');
const http = require('http');

// Load config
dotenv.config({ path: './config/config.env' });

// connect DB
connectDB(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

// app init
const app = express();

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://furnituremecca.vercel.app',
        'https://mecca-dashboard.vercel.app',
        'https://ashley-dashboard-tw-ctxk.vercel.app'
    ],
    optionsSuccessStatus: 200,
    credentials: true
}))

// app.use(express.json({ limit: '200kb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.use('/uploads', express.static('src/assets/uploads'));

// Port assign
const port = process.env.PORT || 3000;

// Get Environment
// const env = app.get('env');

// // morgan lib only for development environment logs only
// if (env === 'development') {
//     app.use(morgan('dev'));
// }

app.use("/",
    asyncHandler(async (req, res, next) => {
        try {
            // console.log("---Request header--", req.headers);
            // console.log("---Request Query---", req.query);
            console.log("---Request Body----", req.body);
            // console.log("---Request Path----", req.path);
            // console.log("---Request File----", req.file);
            next();
        } catch (error) {
            next();
        }
    }),
    api
);

http
    .createServer(app)
    .on("error", (ex) => {
        console.log(ex);
        console.log("Can't connect to server.");
    })
    .listen(port, () => {
        console.log(`Server Started :: ${port}`);
    });