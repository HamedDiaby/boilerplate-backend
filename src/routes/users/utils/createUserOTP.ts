import { v4 as UUID } from 'uuid';
import { DB } from "@configs";
import { CollectionEnum, OTP, otpGenerator } from "@utils";

export const createUserOTP = async(userID: string)=> {
    try {
      const OTP = otpGenerator();
      
      const newOtp:OTP = {
        _id: UUID(),
        _userID: userID,
        OTP: OTP,
      };
  
      await DB.collection(CollectionEnum.MAIL_OTP).doc(newOtp._id).set(newOtp);
  
      return {
        code: 200,
        data: OTP,
      }
  
    } catch (error) {
      return {
        code: 500,
        data: error,
      }
    }
}