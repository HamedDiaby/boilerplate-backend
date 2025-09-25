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
  CreateUserSchema,
  GenderEnum,
  returnErrorWithStatus, returnSuccess
} from '@utils';
import { createUserOTP } from '../utils';

const { hashPassword } = encodedString();

export const createUser = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
  )=> {
    try {
      // Validation des données avec Zod
      const validationResult = CreateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return returnErrorWithStatus(
          res, 
          'Données invalides: ' + validationResult.error.issues.map(i => i.message).join(', '), 
          400
        );
      }

      const userData = validationResult.data;

      // Vérifier si l'utilisateur existe déjà
      const existingUserSnapshot = await DB.collection(CollectionEnum.USERS)
        .where('email', '==', userData.email)
        .get();

      if (!existingUserSnapshot.empty) {
        return returnErrorWithStatus(res, 'Un utilisateur avec cet email existe déjà', 409);
      }
  
      const _id = UUID();
      const salt = UUID();
      const password = hashPassword(userData.password, salt);
  
      const user: User = {
        ...userData,
        _id,
        token: UUID(),
        salt,
        password,
        gender: userData.gender as GenderEnum,
        phoneVerify: false,
        emailVerify: false,
        lastLoginAt: new Date(),
        createAt: new Date(),
      }
  
      let message = 'Utilisateur créé avec succès';
  
      await DB.collection(CollectionEnum.USERS).doc(user._id!).set(user);
  
      const otpCode = await createUserOTP(user._id!);
  
      if(otpCode.code === 500){
        message += " - Impossible de créer le code de vérification du mail!";
      } else {
        const otp = otpCode.data as string;
        const result = await sendConfirmMail(user.email, `${user.firstname} ${user.lastname}`, otp);
    
        if(result.code === 500){
          message += " - Email de confirmation non envoyé";
        } else {
          message += " - Email de confirmation envoyé";
        }
      }
  
      return returnSuccess(res, {
        token: user.token,
        message,
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          city: user.city,
          country: user.country,
          emailVerify: user.emailVerify,
          phoneVerify: user.phoneVerify
        }
      }, 201);
    } catch (error) {
      return returnErrorWithStatus(res, 'Internal Server Error', 500);
    }
};
