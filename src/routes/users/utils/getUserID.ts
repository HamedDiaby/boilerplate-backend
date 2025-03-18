import { DB } from '@configs';

import { 
    CollectionEnum,
    User,
} from '@utils';

export const getUserID = async(token: string)=> {
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
  
      let userID:string = '';
  
      snapshot.forEach(doc=> {
        const userTmp = doc.data() as User;
        userID = userTmp._id!;
      });
  
      return {
        code: 200,
        data: userID,
      }
    } catch (error) {
      return {
        code: 500,
        data: error,
      }
    }
  }