import app from './app';
import wsServer from './wss';

const server = require('http').createServer();
const port = process.env.PORT || 4000;

// const server = app.listen(port, () => console.log(`Sncd API listening on port ${port}!`));
server.on('request', app);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit('connection', ws, request);
  });
  // socket.destroy() if not valid
});

server.listen(port, () => {
  console.log(`Sncd API listening on port ${port}!`);
});


process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
      server.close();
  }
});
