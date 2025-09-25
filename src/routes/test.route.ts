import { PathsEnum, returnSuccess } from '@utils';
import { Router } from 'express';

const router = Router();

router.get(PathsEnum.TEST, (req, res, next) => {
  returnSuccess(res, { message: 'API is working!' }, 200);
});

export default router;
