import admin from 'firebase-admin';
import { serviceAccount } from './firebase.serviceAccount';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
  
const DB = admin.firestore();

export {
    DB
};
