import passport from 'passport';
import { Strategy } from 'passport-local';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import md5 from 'md5';

import { AUTH } from '../../common/config';
import { User as UserEntity } from '../../model/entity/user';
import { User, getOneByUsername, getOneById } from '../../model/user';

const strategy = new Strategy(async (username, password, done) => {
  try {
    // to return a user instead of a token
    const user = await getOneByUsername(username);
    // Non-existing username
    if (!user) {
      done(null, null);
    }

    // Incorrect password
    if (md5(password) !== user.password) {
      done(null, null);
    }

    const accessToken = jwt.sign(
      {
        sub: user.id
      },
      AUTH.jwtSecret,
      { expiresIn: 3600 }
    );

    user.accessToken = accessToken;

    const saved: UserEntity = await user.save();
    done(null, {
      id: saved.id,
      username: saved.username,
      accessToken: saved.accessToken
    });
  } catch (err) {
    done(err, false);
  }
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
    accessToken: user.accessToken
  });
});

export const authenticate = passport.authenticate('local', {
  failureRedirect: AUTH.url
});

export const ensureLogin = (req: Request, res: Response, next: Function) => {
  if (!req.user) {
    res.redirect(AUTH.url);
  } else {
    next();
  }
};
