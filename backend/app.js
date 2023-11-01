// server.js
import express from "express";
import http from "http"
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';

import mongoose from 'mongoose';
import channelRoutes from "./routes/channels.js"
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messages.js"
import './db.js';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/user', userRoutes);
app.use('/messages', messageRoutes);
app.use('/channels', channelRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true,   useCreateIndex: true, });

const User = mongoose.model('User', userSchema);


let messages = [];

io.on('connection', (socket) => {
  socket.emit('loadMessages', messages);

  socket.on('sendMessage', (message) => {
    messages.push(message);
    io.emit('receiveMessage', message);
  });
});

let channelMessages = {
  'general': [],
  'technology': [],
  'meetups':[],
  // Add more predefined channels here
};

io.on('connection', (socket) => {
  socket.on('joinChannel', (channel) => {
    socket.join(channel);
    socket.emit('loadMessages', channelMessages[channel] || []);
  });

  socket.on('sendMessage', ({ channel, message }) => {
    channelMessages[channel].push(message);
    io.to(channel).emit('receiveMessage', message);
  });
});



// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});








