import app from './app';
import bindWsServer from './wss';

const server = require('http').createServer();
const port = process.env.PORT || 4000;

// const server = app.listen(port, () => console.log(`Sncd API listening on port ${port}!`));
server.on('request', app);
bindWsServer(server);

server.listen(port, () => {
  console.log(`Sncd API listening on port ${port}!`);
});


process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
      server.close();
  }
});
