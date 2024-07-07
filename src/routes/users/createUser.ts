import { v4 as UUID } from 'uuid';
import { DB } from '@configs';

import {
  Request, 
  Response, 
  NextFunction,
} from 'express';

import { 
  CollectionEnum,
  User, 
  encodedString, 
  sendConfirmMail,
  returnError,
} from '@utils';
import { createUserOTP } from './utils';

const { hashPassword } = encodedString();

export const createUser = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
  )=> {
    try {
      let user:User = req.body;
  
      if(!user){
        return returnError(res, 'Paramètres incorrects !');
      }
  
      const _id = UUID();
      const salt = UUID();
      const password = hashPassword(user.password!, salt);
  
      user = {
        ...user,
        _id,
        token: UUID(),
        salt,
        password,
        phoneVerify: false,
        emailVerify: false,
        lastLoginAt: new Date(),
        createAt: new Date(),
      }
  
      let message:string = '';
  
      await DB.collection(CollectionEnum.USERS).doc(user._id!).set(user);
  
      const otpCode = await createUserOTP(user._id!);
  
      if(otpCode.code === 500){
        message = "Impossible de creer le code de verification du mail!";
      }
  
      const otp = otpCode.data as string;
      const result = await sendConfirmMail(user.email, `${user.firstname} ${user.lastname}`, otp);
  
      if(result.code === 500){
        message = "Email de confirmation non envoyé";
      }
  
      res.status(200).json({token: user.token, message});
    } catch (error) {
      return returnError(res, error);
    }
};
