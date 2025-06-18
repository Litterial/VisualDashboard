//Back-end framework for RESTful API
const express = require('express');
const http = require('http');
const Websocket = require('ws');
const path = require('path'); // Node.js built-in module

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


//import routes
const testRouter = require('./routes/test');
const indexRouter = require('./routes/index');


//Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build'))); // Adjust path as needed


app.use(`${api}/index`, indexRouter);
app.use(`${api}/test`, testRouter);



app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));


// WebSocket server event handling
wss.on('connection', ws => {
    console.log('Client connected via /ws');

    // Message from client
    ws.on('message', message => {
        console.log(`Received message: ${message}`);

        // Echo the message back to the client
        ws.send(`Server received: ${message}`);

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

module.exports = app;
