import dotenv from 'dotenv';
dotenv.config();

import fileUpload from 'express-fileupload';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';

import cors from 'cors';

import swaggerUI from 'swagger-ui-express';
import { swaggerDocs, sessionConfig, passport } from '@configs';

import testRouter from './routes/test.route';
import usersRouter from './routes/users/router';
import adminSessionRouter from './routes/admin/sessionRouter';
import { PathsEnum } from '@utils';

const app = express();

const allowedOrigins = [
  // a mettre en commentaire pour la mise en prod (localhost)
  'http://localhost:3000', 
  // ajouter ici les domaines de production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(fileUpload({createParentPath: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuration des sessions
app.use(session(sessionConfig));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', testRouter);
app.use(PathsEnum.ADMIN_BASE_ROUTE, adminSessionRouter);
app.use(PathsEnum.USER_BASE_ROUTE, usersRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app;
