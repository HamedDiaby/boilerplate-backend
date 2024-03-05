import {
  Router, 
  Request, 
  Response, 
  NextFunction,
} from 'express';
import { v4 as UUID } from 'uuid';

import { DB } from '@configs';
import { returnError } from '@utils';

const router = Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction)=> {
  res.status(200).send('Hello, Route users');
});

export default router;
