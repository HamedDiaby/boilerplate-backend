import { DB } from '@configs';

import {
    Request, 
    Response, 
    NextFunction,
} from 'express';

import { 
    CollectionEnum, 
    returnError,
} from '@utils';
import { getUserID } from './utils';

export const deleteUserAccount = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      const { token } : { token : string } = req.body;
  
      if(!(token)){
        return returnError(res, 'Paramètres incorrects !');
      }
  
      const userIdReq = await getUserID(token);
  
      if(userIdReq.code === 500){
        return returnError(res, "Impossible de supprimer votre compte pour l'instant !");
      }
  
      const userID = userIdReq.data as string;
  
      await DB.collection(CollectionEnum.USERS).doc(userID).delete();
  
      res.status(200).json({message: 'Compte supprimer avec succes !'});
  
    } catch (error) {
      return returnError(res, error);
    }
};
