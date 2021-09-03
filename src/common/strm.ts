import axios from 'axios';

import { STRM_API_URL, STRM_CLIENT_ID, STRM_CLIENT_SECRET } from './config';

let token: string;

export async function getStrmToken(): Promise<string> {
    if (!token) {
        const response = await axios.get(`${STRM_API_URL}/api/v1/token`, {
            data: {
                clientId: STRM_CLIENT_ID,
                clientSecret: STRM_CLIENT_SECRET
            }
        });
        token = response.data.access_token;
    }
    return token;
}
