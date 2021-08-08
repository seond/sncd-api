'use strict'

import { Response, Request, Router } from 'express';
import { authenticateJwt } from '../middleware/auth';
import { createEntity, deleteEntityById, getAll, getOneById, updateEntityById } from '../handler/common';

import { pluckDbObject } from '../common/helpers';

// basicRouterFactory creates a router for a given entity
// which creates a new object/gets all objects/gets one object with a given ID and does all basic data actions
// This module works only for pre-considered entities.
export function basicRouterFactory(entity: string, router?: Router): Router {
  if (!router) {
    router = new Router();
  }

  router.use(authenticateJwt);

  router.get('/', async (req: Request, res: Response) => {
    const objs = await getAll(entity, req.user.id, true).then(pluckDbObject);
    const data = {};
    data[entity] = objs;
    res.status(200).json(data);
  });

  router.post('/', async (req: Request, res: Response) => {
    const payload = req.body;

    if (!validatePayload(entity, payload)) {
      res.status(400).send();
    }

    const saved = await createEntity(entity, req.user.id, payload).then(pluckDbObject);
    res.status(202).json({
      data: saved
    });
  });

  router.get('/:objId', async (req: Request, res: Response) => {
    try {
      const obj = await getOneById(entity, req.user.id, req.params['objId'], true).then(pluckDbObject);
      const data = {};
      data[entity] = obj;
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(404);
    };
  });

  router.put('/:objId', async (req: Request, res: Response) => {
    const payload = req.body;

    if (!validatePayload(entity, payload)) {
      res.status(400).send();
    }

    const saved = await updateEntityById(entity, req.user.id, req.params['objId'], payload).then(pluckDbObject);
    res.status(204).json({
      data: saved
    });
  });

  router.delete('/:objId', async (req: Request, res: Response) => {
    await deleteEntityById(entity, req.user.id, req.params['objId']);
    res.status(200).send();
  });

  return router;
};

// TODO : use json validation
function validatePayload(entity: string, payload: any): Boolean {
  switch (entity) {
    case 'deck':
      if (!payload.owner) {
        return false;
      }
      break;
  }
  return true;
}
