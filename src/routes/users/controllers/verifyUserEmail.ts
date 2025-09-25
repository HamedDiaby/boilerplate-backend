import { DB } from '@configs';

import {
    Request, 
    Response, 
    NextFunction,
} from 'express';

import { 
    CollectionEnum,
    OTP,
    returnErrorWithStatus,
    returnSuccess,
} from '@utils';
import { getUserID } from '../utils';

export const verifyUserEmail = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      const { token, otp } : { token: string, otp: string } = req.body;
  
      if(!(token && otp)){
        return returnErrorWithStatus(res, 'Paramètres incorrects !', 400);
      }
  
      const userIdReq = await getUserID(token);
  
      if(userIdReq.code === 500){
        return returnErrorWithStatus(res, 'Impossible de verifier votre email !', 500);
      }
  
      const userID = userIdReq.data as string;
  
      const snapshot = await DB.collection(CollectionEnum.MAIL_OTP)
                        .where('_userID', '==', userID).where('OTP', '==', otp).get();
      
      if(snapshot.empty){
        return returnErrorWithStatus(res, 'Code incorrect !', 400);
      }
  
      let getOtp:OTP | null = null;
  
      snapshot.forEach(async(doc)=> {
        getOtp = doc.data() as OTP;
        await DB.collection(CollectionEnum.MAIL_OTP).doc(getOtp._id!).delete();
      });
      
      await DB.collection(CollectionEnum.USERS).doc(userID).update({emailVerify: true});
  
      return returnSuccess(res, {message: 'Email vérifié !'});
    } catch (error) {
      return returnErrorWithStatus(res, 'Erreur lors de la vérification de l\'email', 500);
    }
};
