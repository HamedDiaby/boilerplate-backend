import admin from 'firebase-admin';

export const serviceAccount:admin.ServiceAccount = {
    projectId: process.env.FIREBASE_project_id, 
    privateKey: process.env.FIREBASE_private_key?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_client_email, 
}
