import { Server as WSServer } from 'ws';

const bindWsServer = (server) => {
    const wsServer = new WSServer({
        server,
        perMessageDeflate: false
    });

    wsServer.on('connection', wss => {
        wss.send('Socket open');
    });
};

export default bindWsServer;
