//Load environment variables from .env file
require('dotenv').config();

//Back-end framework for RESTful API
const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require('express');
const http = require('http');
const Websocket = require('ws');
// Node.js built-in module
const path = require('path');
const mongoose = require('mongoose');

// const dns = require('dns');
// const url = require('url');

const api = "/api/v1";
const wsPath = "/ws"
// HTTP request logger middleware
const logger = require('morgan');
const port = process.env.PORT || 5000;

//Allows a server to indicate any origins (domain, scheme, or port)
const cors = require('cors');
const app = express();


//Create HTTP server from express App
const server = http.createServer(app);

//Initialize websocket server via HTTP server instance
const wss = new Websocket.Server({ server, path: wsPath });


//Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;


//import routes
const testRouter = require('./routes/test');
const indexRouter = require('./routes/index');
const crimeRouter = require('./routes/crimeRoute');
const locationRouter = require('./routes/locationRoute');


//Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build'))); // Adjust path as needed


app.use(`${api}/index`, indexRouter);
app.use(`${api}/test`, testRouter);
app.use(`${api}/crime`, crimeRouter);
app.use(`${api}/location`, locationRouter);



app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));


// WebSocket server event handling
wss.on('connection', ws => {
    console.log('Client connected via /ws');

    // Message from client
    ws.on('message', message => {
        console.log(`Received message: ${message}`);

        // Echo the message back to the client
        //ws.send(`Server received: ${message}`);

        // Broadcast to all connected clients (except the sender)
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`Broadcast: ${message}`);
            }
        });
    });

    // Handle connection closure
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });

    // Send a welcome message to the newly connected client
    //ws.send('Welcome to the WebSocket server!');
});

// Start the HTTP server (which the WebSocket server is attached to)
server.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
    console.log(`WebSocket server running on ws://localhost:${port}${wsPath}`);
});

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
    dbName:'Crimes',
    // Recommended for newer versions
    useNewUrlParser: true,
    // Recommended
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
})
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        if(err.name === "MongooseServerError") {
            console.log(err.reason.servers);
        }
        // Exit process with failure
        process.exit(1);
    });


module.exports = app;
