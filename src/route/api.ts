'use strict'

import { Response, Request, Router } from 'express';
import { basicRouterFactory } from './basic';
import { createEntity, getOneById } from '../handler/common';
// import { Deck } from '../model/deck';

export const router = new Router();

const deckRouter = basicRouterFactory('deck');
router.use('/deck', deckRouter);
