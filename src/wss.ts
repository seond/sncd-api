import { Server as WSServer } from 'ws';
import { Strm } from 'strm-client-lib';

import { STRM_API_URL, STRM_CS_URL } from './common/config';
import { getOneById as getDeckById } from './model/deck';
import { parseUrlQueryParams } from './common/helpers';
import { getStrmToken } from './common/strm';

const conns = {};

const wsServer = new WSServer({
    noServer: true,
    clientTracking: true
});

wsServer.on('connection', async (ws, request, client) => {
    ws.send('Socket open');
    const params = parseUrlQueryParams(request.url);
    const deckId = params['deck_id'];
    const userId = params['user_id'];
    if (!deckId || !userId) {
        ws.close();
        return;
    }

    const deck = await getDeckById(userId, deckId);
    ws.deck = deck;

    let conn = conns[deck.strmId];
    if (!conn) {
        conn = await getNewStrmConnection(deck.strmId);
        conn.onChange((doc, revisionNumber) => {
            // TODO: validate doc
            wsServer.clients.forEach(client => {
                if (client.deck.strmId === deck.strmId) {
                    client.send(JSON.stringify({
                        slides: doc.slides,
                        currentSlide: doc.currentSlide,
                        revisionNumber
                    }));
                }
            })
        });
    }
});

export default wsServer;

async function getNewStrmConnection(strmId: string) {
    const strmToken = await getStrmToken();
    const strmClient = new Strm(strmId, strmToken, {
        api_url: `${STRM_API_URL}/api/v1/docs`,
        ws_url: STRM_CS_URL
    });
    strmClient.init();
    strmClient.connect();

    return strmClient;
}
