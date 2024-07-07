import { v4 as UUID } from 'uuid';
import { DB } from '@configs';

import {
    Request, 
    Response, 
    NextFunction,
} from 'express';

import { 
    CollectionEnum,
    encodedString, 
    returnError,
} from '@utils';
import { getUserID } from './utils';

const { hashPassword } = encodedString();

export const updateUserPassword = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      const { token, newPassword } : { token: string, newPassword: string } = req.body;
  
      if(!(token && newPassword)){
        return returnError(res, 'Paramètres incorrects !');
      }
  
      const userIdReq = await getUserID(token);
  
      if(userIdReq.code === 500){
        return returnError(res, 'Impossible de modifier le mot de passe !');
      }
  
      const userID = userIdReq.data as string;
      const salt = UUID();
      const password = hashPassword(newPassword, salt);
  
      await DB.collection(CollectionEnum.USERS).doc(userID).update({
        token: UUID(),
        salt,
        password,
      });
  
      res.status(200).json({message: 'Mot de passe mis à jour !'});
    } catch (error) {
      return returnError(res, error);
    }
};
