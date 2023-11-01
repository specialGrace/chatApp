// WebSocket server
import WebSocket from 'ws';
import Message from "./models/Message"
import Channel from "./models/Channel"


// Initialize a WebSocket server instance
const wss = new WebSocket.Server({ port: 3000});
const channels = {};

wss.on('connection', (ws) => {
  
  // Assign a unique ID to each WebSocket connection (for private messaging)
  ws.id = uuid.v4();
  
  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message);
    // Handling channel joining
    if (parsedMessage.action === 'join') {
      const channelName = parsedMessage.channel;
      
      if (!channels[channelName]) {
        channels[channelName] = [];
      }
      
      channels[channelName].push(ws);
    }

    
    // Handling private messages
    if (parsedMessage.action === 'private') {
      const recipientWs = findWebSocketById(parsedMessage.recipientId);
      
      if (recipientWs) {
        recipientWs.send(JSON.stringify({ message: parsedMessage.message }));
      }
    }
    
        // Create and save the message
        const newMessage = new Message({
          content: parsedMessage.content,
          sender: parsedMessage.sender,
          channel: parsedMessage.channel,
          timestamp: new Date()
        });
    
        await newMessage.save();
   
    if (parsedMessage.action === 'joinChannel') {
        const channelMessages = await fetchMessages(parsedMessage.channel);
        
        // Send the message history to the client
        ws.send(JSON.stringify({ action: 'messageHistory', messages: channelMessages }));
      }

      const channel = await Channel.findOne({ name: parsedMessage.channel });
      if (channel) {
        channel.messages.push(newMessage);
        await channel.save();
      } else {
        // If the channel doesn't exist, create it
        const newChannel = new Channel({
          name: parsedMessage.channel,
          messages: [newMessage]
        });
      
        await newChannel.save();
      }; // To hold the channel data
      
      async function fetchMessages(channelName) {
          const channel = await Channel.findOne({ name: channelName }).populate('messages');
          return channel ? channel.messages : [];
        }
    
 
    
    // More message handling logic here...
     // Broadcast the message to others in the same channel
     if (channels[parsedMessage.channel]) {
      channels[parsedMessage.channel].forEach((clientWs) => {
        if (clientWs !== ws && clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify(newMessage));
        }
      });
    }

  });

  
});

