'use strict'

import { Response, Request, Router } from 'express';
import { basicRouterFactory } from './basic';
import { getOneById as getTeamById } from '../model/team';
import { getOneById as getUserById } from '../model/user';

export const router = new Router();

const deckRouter = basicRouterFactory('deck');
router.use('/deck', deckRouter);

const teamRouter = basicRouterFactory('team');
teamRouter.post('/:teamId/member/:userId', async (req: Request, res: Response) => {
    const team = await getTeamById(req.user.id, req.params['teamId']);
    console.log(team);
    const user = await getUserById(req.params['userId']);

    team.addNewMember(user);
    
    const saved = await team.save();
    res.status(202).json({
        data: saved
    });
});

router.use('/team', teamRouter);
