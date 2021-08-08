'use strict'

import { Router } from 'express';

import { AUTH } from '../common/config';

import { router as apiRoutes } from './api';
import { router as authRoutes } from './auth';


export const router = new Router();

router.use('/api', apiRoutes);
router.use('/', authRoutes);
