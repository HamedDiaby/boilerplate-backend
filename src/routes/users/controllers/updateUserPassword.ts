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
    returnSuccess,
} from '@utils';
import { getUserID } from '../utils';
import { UpdatePasswordSchema } from '../models/validation.schemas';

const { hashPassword } = encodedString();

export const updateUserPassword = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      // Validation des données avec Zod
      const validationResult = UpdatePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return returnErrorWithStatus(
          res, 
          'Données invalides: ' + validationResult.error.issues.map(i => i.message).join(', '), 
          400
        );
      }

      const { token, newPassword } = validationResult.data;
  
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
  
      return returnSuccess(res, {message: 'Mot de passe mis à jour !'});
    } catch (error) {
      return returnErrorWithStatus(res, 'Erreur lors de la mise à jour du mot de passe', 500);
    }
};
