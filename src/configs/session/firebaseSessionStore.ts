import { SessionData } from 'express-session';
import { Store } from 'express-session';
import { DB } from '../dbConfigs';
import { CollectionEnum } from '@utils';

export class FirebaseSessionStore extends Store {
    private db: FirebaseFirestore.Firestore;
    private collectionName: string;

    constructor() {
        super();
        this.db = DB;
        this.collectionName = CollectionEnum.SESSIONS;
    }

    /**
     * Récupérer une session par son ID
     */
    async get(sessionId: string, callback: (err: any, session?: SessionData | null) => void): Promise<void> {
        try {
            const sessionDoc = await this.db.collection(this.collectionName).doc(sessionId).get();
            
            if (!sessionDoc.exists) {
                return callback(null, null);
            }

            const sessionData = sessionDoc.data() as SessionData;
            
            // Vérifier l'expiration
            if (sessionData.cookie && sessionData.cookie.expires) {
                const expirationDate = new Date(sessionData.cookie.expires);
                if (expirationDate <= new Date()) {
                    // Session expirée, la supprimer
                    await this.destroy(sessionId, () => {});
                    return callback(null, null);
                }
            }

            callback(null, sessionData);
        } catch (error) {
            callback(error);
        }
    }

    /**
     * Sauvegarder une session
     */
    async set(sessionId: string, session: SessionData, callback?: (err?: any) => void): Promise<void> {
        try {
            const sessionDoc = {
                ...session,
                lastAccess: new Date(),
                sessionId: sessionId
            };

            await this.db.collection(this.collectionName).doc(sessionId).set(sessionDoc, { merge: true });
            
            if (callback) callback();
        } catch (error) {
            if (callback) callback(error);
        }
    }

    /**
     * Supprimer une session
     */
    async destroy(sessionId: string, callback?: (err?: any) => void): Promise<void> {
        try {
            await this.db.collection(this.collectionName).doc(sessionId).delete();
            if (callback) callback();
        } catch (error) {
            if (callback) callback(error);
        }
    }

    /**
     * Supprimer toutes les sessions
     */
    async clear(callback?: (err?: any) => void): Promise<void> {
        try {
            const batch = this.db.batch();
            const sessionsSnapshot = await this.db.collection(this.collectionName).get();
            
            sessionsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            if (callback) callback();
        } catch (error) {
            if (callback) callback(error);
        }
    }

    /**
     * Compter le nombre de sessions actives
     */
    async length(callback: (err: any, length?: number) => void): Promise<void> {
        try {
            const snapshot = await this.db.collection(this.collectionName).get();
            callback(null, snapshot.size);
        } catch (error) {
            callback(error);
        }
    }

    /**
     * Obtenir toutes les sessions (utilisé pour le touch)
     */
    async all(callback: (err: any, sessions?: { [sid: string]: SessionData } | null) => void): Promise<void> {
        try {
            const snapshot = await this.db.collection(this.collectionName).get();
            const sessions: { [sid: string]: SessionData } = {};
            
            snapshot.forEach(doc => {
                sessions[doc.id] = doc.data() as SessionData;
            });
            
            callback(null, sessions);
        } catch (error) {
            callback(error);
        }
    }

    /**
     * Mettre à jour l'horodatage de la session (touch)
     */
    async touch(sessionId: string, session: SessionData, callback?: (err?: any) => void): Promise<void> {
        try {
            await this.db.collection(this.collectionName).doc(sessionId).update({
                lastAccess: new Date(),
                cookie: session.cookie
            });
            
            if (callback) callback();
        } catch (error) {
            if (callback) callback(error);
        }
    }

    /**
     * Nettoyer les sessions expirées (à appeler périodiquement)
     */
    async cleanupExpiredSessions(): Promise<void> {
        try {
            const now = new Date();
            const batch = this.db.batch();
            
            // Récupérer toutes les sessions
            const sessionsSnapshot = await this.db.collection(this.collectionName).get();
            
            let deletedCount = 0;
            
            sessionsSnapshot.forEach(doc => {
                const sessionData = doc.data();
                
                // Vérifier si la session a expiré
                if (sessionData.cookie && sessionData.cookie.expires) {
                    const expirationDate = new Date(sessionData.cookie.expires);
                    if (expirationDate <= now) {
                        batch.delete(doc.ref);
                        deletedCount++;
                    }
                }
                // Supprimer aussi les sessions très anciennes sans expiration
                else if (sessionData.lastAccess) {
                    const lastAccessDate = new Date(sessionData.lastAccess);
                    const daysDiff = (now.getTime() - lastAccessDate.getTime()) / (1000 * 3600 * 24);
                    
                    if (daysDiff > 30) { // Sessions de plus de 30 jours
                        batch.delete(doc.ref);
                        deletedCount++;
                    }
                }
            });
            
            if (deletedCount > 0) {
                await batch.commit();
                console.log(`🧹 Nettoyage terminé: ${deletedCount} sessions expirées supprimées`);
            }
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage des sessions:', error);
        }
    }
}