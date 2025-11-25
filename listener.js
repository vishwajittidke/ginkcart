// Save as 'listener.js'
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    // UPDATED: Use req.socket.remoteAddress
    console.log(`[${new Date()}] Visitor IP: ${req.ip || req.socket.remoteAddress}`);
    fs.appendFileSync("ips.txt", `[${new Date()}] IP: ${req.ip || req.socket.remoteAddress}\n`);
    
    res.sendFile(__dirname + '/index.html'); // serve static landing HTML below
});

io.on('connection', (socket) => {
    console.log(`Socket connected from: ${socket.handshake.address}`);
    fs.appendFileSync("sockets.txt", `[${new Date()}] Socket IP: ${socket.handshake.address}\n`);

    setInterval(() => {
        socket.emit('pulse', { ts: Date.now(), msg: 'Keep-alive beacon active.' });
    }, 5000);
});

server.listen(8080, () => {
    console.log("Listening on :8080");
});
