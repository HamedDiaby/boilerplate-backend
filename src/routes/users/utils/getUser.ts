import { DB } from '@configs';

import { 
    CollectionEnum,
    User,
} from '@utils';

export const getUser = async(token: string)=> {
    try {
      if(!token){
        return {
          code: 500,
          data: 'Pas de token',
        }
      }
  
      const snapshot = await DB.collection(CollectionEnum.USERS)
                        .where('token', '==', token).get();
      
      if(snapshot.empty){
        return {
          code: 500,
          data: 'Pas de users',
        }
      }
  
      let user:User | null = null;
  
      snapshot.forEach(doc=> {
        const userTmp = doc.data() as User;
  
        user = {
          ...(userTmp.gender ? {gender: userTmp.gender} : {}),
          ...(userTmp.phone ? {phone: userTmp.phone} : {}),
          ...(userTmp.birthDate ? {birthDate: userTmp.birthDate} : {}),
          ...(userTmp.city ? {city: userTmp.city} : {}),
          ...(userTmp.country ? {country: userTmp.country} : {}),
          token: userTmp.token,
          firstname: userTmp.firstname,
          lastname: userTmp.lastname,
          email: userTmp.email,
          phoneVerify: userTmp.phoneVerify,
          emailVerify: userTmp.emailVerify,
          lastLoginAt: userTmp.lastLoginAt,
          createAt: userTmp.createAt,
        };
      });
  
      return {
        code: 200,
        data: user,
      }
    } catch (error) {
      return {
        code: 500,
        data: error,
      }
    }
}
