const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const WebSocket = require('ws');

exports.setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const token = new URLSearchParams(req.url.replace('/?', '')).get('token');
        let username;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                username = decoded.username;
            } catch (err) {
                ws.close();
                return;
            }
        } else {
            ws.close();
            return;
        }

        ws.on('message', async (message) => {
            const data = JSON.parse(message);
            const { message: userMessage } = data;
            const timestamp = new Date().toLocaleTimeString();

            const newMessage = new Message({ username, message: userMessage, timestamp });
            await newMessage.save();

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ username, message: userMessage, timestamp }));
                }
            });
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });

        console.log('WebSocket connection established');
    });
};
