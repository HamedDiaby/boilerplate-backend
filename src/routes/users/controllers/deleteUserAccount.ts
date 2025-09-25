import { DB } from '@configs';

import {
    Request, 
    Response, 
    NextFunction,
} from 'express';

import { 
    CollectionEnum, 
    returnErrorWithStatus,
    returnSuccess,
} from '@utils';
import { getUserID } from '../utils';
import { DeleteUserAccountSchema } from '../models/validation.schemas';

export const deleteUserAccount = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      // Validation des données avec Zod
      const validationResult = DeleteUserAccountSchema.safeParse(req.body);
      if (!validationResult.success) {
        return returnErrorWithStatus(
          res, 
          'Données invalides: ' + validationResult.error.issues.map(i => i.message).join(', '), 
          400
        );
      }

      const { token } = validationResult.data;
  
      const userIdReq = await getUserID(token);
  
      if(userIdReq.code === 500){
        return returnErrorWithStatus(res, "Impossible de supprimer votre compte pour l'instant !", 500);
      }
  
      const userID = userIdReq.data as string;
  
      await DB.collection(CollectionEnum.USERS).doc(userID).delete();
  
      return returnSuccess(res, {message: 'Compte supprimé avec succès !'});
  
    } catch (error) {
      return returnErrorWithStatus(res, 'Internal Server Error', 500);
    }
};
