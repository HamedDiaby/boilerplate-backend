import { PathsEnum } from '@utils';
import { Router } from 'express';

const router = Router();

router.get(PathsEnum.TEST, (req, res, next) => {
  res.status(200).json({ message: 'API is working!' });
});

export default router;
