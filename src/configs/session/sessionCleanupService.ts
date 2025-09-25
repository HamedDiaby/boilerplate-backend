import { FirebaseSessionStore } from './firebaseSessionStore';

/**
 * Service de nettoyage automatique des sessions expirées
 */
export class SessionCleanupService {
    private store: FirebaseSessionStore;
    private cleanupInterval: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    constructor(store: FirebaseSessionStore) {
        this.store = store;
    }

    /**
     * Démarrer le nettoyage automatique
     * @param intervalHours - Intervalle en heures entre les nettoyages (défaut: 6h)
     */
    start(intervalHours: number = 6): void {
        if (this.isRunning) {
            console.log('🔄 Service de nettoyage des sessions déjà en cours');
            return;
        }

        const intervalMs = intervalHours * 60 * 60 * 1000; // Convertir en millisecondes
        
        // Nettoyage immédiat au démarrage
        this.cleanup();
        
        // Programmer les nettoyages périodiques
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, intervalMs);

        this.isRunning = true;
        console.log(`🚀 Service de nettoyage des sessions démarré (intervalle: ${intervalHours}h)`);
    }

    /**
     * Arrêter le nettoyage automatique
     */
    stop(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        
        this.isRunning = false;
        console.log('🛑 Service de nettoyage des sessions arrêté');
    }

    /**
     * Exécuter un nettoyage manuel
     */
    async cleanup(): Promise<void> {
        try {
            console.log('🧹 Début du nettoyage des sessions expirées...');
            await this.store.cleanupExpiredSessions();
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage des sessions:', error);
        }
    }

    /**
     * Obtenir le statut du service
     */
    getStatus(): { isRunning: boolean; intervalActive: boolean } {
        return {
            isRunning: this.isRunning,
            intervalActive: this.cleanupInterval !== null
        };
    }

    /**
     * Obtenir des statistiques sur les sessions
     */
    async getSessionStats(): Promise<{
        totalSessions: number;
        activeSessions: number;
        expiredSessions: number;
    }> {
        return new Promise((resolve, reject) => {
            this.store.all((err, sessions) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!sessions) {
                    resolve({ totalSessions: 0, activeSessions: 0, expiredSessions: 0 });
                    return;
                }

                const now = new Date();
                let activeSessions = 0;
                let expiredSessions = 0;

                Object.values(sessions).forEach(session => {
                    if (session.cookie && session.cookie.expires) {
                        const expirationDate = new Date(session.cookie.expires);
                        if (expirationDate > now) {
                            activeSessions++;
                        } else {
                            expiredSessions++;
                        }
                    } else {
                        activeSessions++; // Sessions sans expiration considérées comme actives
                    }
                });

                resolve({
                    totalSessions: Object.keys(sessions).length,
                    activeSessions,
                    expiredSessions
                });
            });
        });
    }
}

// Instance singleton du service
let cleanupServiceInstance: SessionCleanupService | null = null;

export const getSessionCleanupService = (store: FirebaseSessionStore): SessionCleanupService => {
    if (!cleanupServiceInstance) {
        cleanupServiceInstance = new SessionCleanupService(store);
    }
    return cleanupServiceInstance;
};