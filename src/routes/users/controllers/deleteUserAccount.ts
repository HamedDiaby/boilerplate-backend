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

export const deleteUserAccount = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      const { token } : { token : string } = req.body;
  
      if(!(token)){
        return returnErrorWithStatus(res, 'Paramètres incorrects !', 400);
      }
  
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
