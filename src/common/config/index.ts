'use strict';

import { auth } from '../../../config.json';

export const AUTH = auth;
const { STRM_CLIENT_ID, STRM_CLIENT_SECRET, STRM_API_URL, STRM_CS_URL, STRM_PD_URL } = process.env;

export {
    STRM_CLIENT_ID,
    STRM_CLIENT_SECRET,
    STRM_API_URL,
    STRM_CS_URL,
    STRM_PD_URL
};
