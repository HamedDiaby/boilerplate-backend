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
      return returnError(res, 'Paramètres incorrects !');
    }

    const userIdReq = await getUserID(token);

    if(userIdReq.code === 500){
      return returnError(res, 'Impossible de metre à jours les infos !');
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
    return returnError(res, error);
  }
};
