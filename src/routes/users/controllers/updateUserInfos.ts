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
import { UpdateUserInfosSchema } from '../models/validation.schemas';

export const updateUserInfos = async(
  req: Request, 
  res: Response, 
  next: NextFunction,
)=> {
  try {
    // Validation des données avec Zod
    const validationResult = UpdateUserInfosSchema.safeParse(req.body);
    if (!validationResult.success) {
      return returnErrorWithStatus(
        res, 
        'Données invalides: ' + validationResult.error.issues.map(i => i.message).join(', '), 
        400
      );
    }

    const { token, firstname, lastname, city, country, birthDate } = validationResult.data;

    const userIdReq = await getUserID(token);

    if(userIdReq.code === 500){
      return returnErrorWithStatus(res, 'Impossible de mettre à jour les infos !', 500);
    }

    const userID = userIdReq.data as string;

    // Construire l'objet de mise à jour avec seulement les champs fournis
    const updateData: any = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (birthDate !== undefined) updateData.birthDate = birthDate;

    // Une seule mise à jour avec tous les champs
    if (Object.keys(updateData).length > 0) {
      await DB.collection(CollectionEnum.USERS).doc(userID).update(updateData);
    }

    return returnSuccess(res, {message: 'Infos mis à jour !'});
  } catch (error) {
    return returnErrorWithStatus(res, 'Erreur lors de la mise à jour des infos', 500);
  }
};
