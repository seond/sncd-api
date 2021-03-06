import express from 'express';
import cors from 'cors';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { router } from './route';
import bootstrap from './bootstrap';
import { middleware as graphQL } from './graphql';

const app = express();

// tslint:disable-next-line:no-backbone-get-set-outside-model
app.set('view engine', 'ejs');
// tslint:disable-next-line:no-backbone-get-set-outside-model
app.set('views', __dirname+'/views');
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(expressSession({ secret: 's3sions3cr3t', maxAge:null }));
app.use(passport.initialize());
app.use(passport.session());

bootstrap(() => {
  console.log('Bootstrap complete: opening up API routes');
  app.use('/', router);
});

if (!process.env.DISABLE_GRAPHQL) {
  app.use('/graphql', graphQL);
}

export default app;
