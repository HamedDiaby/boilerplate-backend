import session from 'express-session';
import { FirebaseSessionStore } from './firebaseSessionStore';
import { getSessionCleanupService } from './sessionCleanupService';

// Créer l'instance du store Firebase
const firebaseStore = new FirebaseSessionStore();

// Démarrer le service de nettoyage automatique
const cleanupService = getSessionCleanupService(firebaseStore);

// Démarrer le nettoyage toutes les 6 heures en production, toutes les heures en développement
const cleanupInterval = process.env.NODE_ENV === 'production' ? 6 : 1;
cleanupService.start(cleanupInterval);

// Configuration des sessions avec le store Firebase
export const sessionConfig: session.SessionOptions = {
    store: firebaseStore,
    secret: process.env.SESSION_SECRET || 'session_secret_change_in_production',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Renouvelle la session à chaque requête
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
        sameSite: 'lax'
    },
    name: 'backend.session'
};

// Exporter le service de nettoyage pour usage externe
export { cleanupService, firebaseStore };