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
    returnErrorWithStatus,
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
        return returnErrorWithStatus(res, 'Paramètres incorrects !', 400);
      }
  
      const userIdReq = await getUserID(token);
  
      if(userIdReq.code === 500){
        return returnErrorWithStatus(res, 'Impossible de modifier le mot de passe !', 500);
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
      return returnErrorWithStatus(res, 'Erreur lors de la mise à jour du mot de passe', 500);
    }
};
