import { DB } from '@configs';

import {
  Request, 
  Response, 
  NextFunction,
} from 'express';

import { 
  CollectionEnum, 
  returnErrorWithStatus,
} from '@utils';
import { getUserID } from './utils';

export const updateUserInfos = async(
  req: Request, 
  res: Response, 
  next: NextFunction,
)=> {
  try {
    const { 
      token, 
      firstname,
      lastname,
      city,
      country,
      birthDate,
    } : { 
      token: string, 
      firstname: string,
      lastname: string,
      city: string,
      country: string,
      birthDate: Date,
    } = req.body;

    if(!(token)){
      return returnErrorWithStatus(res, 'Paramètres incorrects !', 400);
    }

    const userIdReq = await getUserID(token);

    if(userIdReq.code === 500){
      return returnErrorWithStatus(res, 'Impossible de metre à jours les infos !', 500);
    }

    const userID = userIdReq.data as string;

    if(firstname){
      await DB.collection(CollectionEnum.USERS).doc(userID).update({firstname});
    }
    if(lastname){
      await DB.collection(CollectionEnum.USERS).doc(userID).update({lastname});
    }
    if(city){
      await DB.collection(CollectionEnum.USERS).doc(userID).update({city});
    }
    if(country){
      await DB.collection(CollectionEnum.USERS).doc(userID).update({country});
    }
    if(birthDate){
      await DB.collection(CollectionEnum.USERS).doc(userID).update({birthDate});
    }

    res.status(200).json({message: 'Infos mis à jour !'});
  } catch (error) {
    return returnErrorWithStatus(res, 'Erreur lors de la mise à jour des infos', 500);
  }
};
