require('dotenv').config();
const http = require('http');
const { setupWebSocketServer } = require('./controllers/chatController');
const { registerUser, loginUser } = require('./controllers/authController');
const url = require('url');
const bodyParser = require('body-parser');

// Define CORS options
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',  // Allow requests from any origin if not specified
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization',  // Allowed request headers
    credentials: true,  // Allow cookies to be sent with requests
};

// CORS Middleware Function
const corsMiddleware = (req, res) => {
    const { origin } = req.headers;

    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods);
    res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders);
    res.setHeader('Access-Control-Allow-Credentials', corsOptions.credentials);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);  // No Content
        res.end();
        return true;  // Indicate that the request is handled
    }
    return false;  // Continue processing the request
};

const server = http.createServer((req, res) => {
    // Apply CORS middleware
    if (corsMiddleware(req, res)) {
        return;  // Stop further processing for CORS preflight requests
    }

    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/register' && req.method === 'POST') {
        bodyParser.json()(req, res, () => {
            registerUser(req, res);
        });
    } else if (parsedUrl.pathname === '/login' && req.method === 'POST') {
        bodyParser.json()(req, res, () => {
            loginUser(req, res);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Set up WebSocket server
setupWebSocketServer(server);

module.exports = server;
