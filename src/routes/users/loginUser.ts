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
    returnError,
} from '@utils';
import { getUser } from './utils';

const { hashPassword } = encodedString();

export const loginUser = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
      const { email, password } : { email: string, password: string } = req.body;
  
      if(!(email && password)){
        return returnError(res, 'Paramètres incorrects !');
      }
  
      const snapshot = await DB.collection(CollectionEnum.USERS)
                        .where('email', '==', email).get();
  
      if(snapshot.empty){
        return returnError(res, "Pas d'utilisateur");
      }
  
      let token:string = '';
      
      snapshot.forEach(doc=> {
        const userTmp = doc.data() as User;
        const passwordVerify = hashPassword(password, userTmp.salt!);
  
        if(passwordVerify === userTmp.password){
          token = userTmp.token!;
        }
      });
      
      if(!token){
        return returnError(res, "Pas d'utilisateur");
      }
  
      const user = await getUser(token);
  
      if(user.code === 500){
        return returnError(res, user.data);
      }
  
      res.status(200).json(user.data);
    } catch (error) {
      return returnError(res, error);
    }
};
