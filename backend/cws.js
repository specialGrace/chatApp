// Initialize a WebSocket object
const ws = new WebSocket('ws://localhost:3000');

// Event listener for successful connection
ws.addEventListener('open', () => {
  console.log('Connected to the WebSocket server');

  // To send a message
ws.send('Hello, server!');

// To receive a message
ws.addEventListener('message', (event) => {
  console.log(`Received: ${event.data}`);
});

});
