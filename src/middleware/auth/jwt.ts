import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

import { AUTH } from '../../common/config';
import { User, getOneById } from '../../model/user';

const jwtOpts = {
  jwtFromRequest: (req: Request) => {
    if (req && req.cookies && req.cookies['token']) {
      return req.cookies['token'];
    }
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  },
  secretOrKey: AUTH.jwtSecret
};

const strategy = new Strategy(jwtOpts, async (jwtPayload, done) => {
  if (!jwtPayload.sub) {
    done(null, false);
    return;
  }

  const client = await getOneById(jwtPayload.sub);
  done(null, client);
});

passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (userId, done) => {
  const user = await getOneById(userId);

  // Non-existing user
  if (!user) {
    done(null, null);
  }

  done(null, {
    userId,
    username: 'FAKE'
  });
});

export const authenticate = passport.authenticate('jwt', { session: true });
