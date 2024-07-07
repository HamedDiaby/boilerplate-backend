import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

export const encodedString = ()=> {

    const hashPassword = (password: string, salt: string)=> {
        const passwordHashed = Base64.stringify(sha256(password + salt));
        return passwordHashed;
    }

    return {
        hashPassword,
    }
}