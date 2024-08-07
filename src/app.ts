import dotenv from 'dotenv';
dotenv.config();

import fileUpload from 'express-fileupload';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import cors from 'cors';

import swaggerUI from 'swagger-ui-express';
import { swaggerDocs } from '@configs';

import usersRouter from './routes/users/router';

const app = express();

const allowedOrigins = [
  // a mettre en commentaire pour la mise en prod (localhost)
  'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 
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

app.use('/users', usersRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app;
