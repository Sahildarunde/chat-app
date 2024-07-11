require('dotenv').config();
const http = require('http');
const { setupWebSocketServer } = require('./controllers/chatController');
const { registerUser, loginUser } = require('./controllers/authController');
const url = require('url');
const bodyParser = require('body-parser');


const corsOptions = {
    origin: '*',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  
    allowedHeaders: 'Content-Type,Authorization',  
    credentials: true, 
};

const corsMiddleware = (req, res) => {
    const { origin } = req.headers;

    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods);
    res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders);
    res.setHeader('Access-Control-Allow-Credentials', corsOptions.credentials);

  
    if (req.method === 'OPTIONS') {
        res.writeHead(204);  
        res.end();
        return true;  
    }
    return false;  
};

const server = http.createServer((req, res) => {
    //cors logic
    if (corsMiddleware(req, res)) {
        return;  
    }

    const parsedUrl = url.parse(req.url, true);

    //route the requests here
    if (parsedUrl.pathname === '/register' && req.method === 'POST') {
        bodyParser.json()(req, res, () => {
            registerUser(req, res);
        });
    } else if (parsedUrl.pathname === '/login' && req.method === 'POST') {
        bodyParser.json()(req, res, () => {
            loginUser(req, res);
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});


setupWebSocketServer(server);

module.exports = server;
