import { DB } from '@configs';

import {
    Request, 
    Response, 
    NextFunction,
} from 'express';

import { 
    CollectionEnum,
    OTP,
    returnError,
} from '@utils';
import { getUserID } from './utils';

export const verifyUserEmail = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      const { token, otp } : { token: string, otp: string } = req.body;
  
      if(!(token && otp)){
        return returnError(res, 'Paramètres incorrects !');
      }
  
      const userIdReq = await getUserID(token);
  
      if(userIdReq.code === 500){
        return returnError(res, 'Impossible de verifier votre email !');
      }
  
      const userID = userIdReq.data as string;
  
      const snapshot = await DB.collection(CollectionEnum.MAIL_OTP)
                        .where('_userID', '==', userID).where('OTP', '==', otp).get();
      
      if(snapshot.empty){
        return returnError(res, 'Code incorrect !');
      }
  
      let getOtp:OTP | null = null;
  
      snapshot.forEach(async(doc)=> {
        getOtp = doc.data() as OTP;
        await DB.collection(CollectionEnum.MAIL_OTP).doc(getOtp._id!).delete();
      });
      
      await DB.collection(CollectionEnum.USERS).doc(userID).update({emailVerify: true});
  
      res.status(200).json({message: 'Email verifié !'});
    } catch (error) {
      return returnError(res, error);
    }
};
