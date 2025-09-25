import {
    Request,
    Response,
    NextFunction,
} from 'express';

import { cleanupService, firebaseStore } from '../../configs/session/sessionConfig';
import { returnErrorWithStatus, returnSuccess } from '../../utils/utilities/responseHelper';

/**
 * Obtenir les statistiques des sessions
 */
export const getSessionStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const stats = await cleanupService.getSessionStats();
        const serviceStatus = cleanupService.getStatus();

        return returnSuccess(res, {
            ...stats,
            cleanupService: serviceStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return returnErrorWithStatus(res, 'Erreur lors de la récupération des statistiques', 500);
    }
};

/**
 * Forcer un nettoyage manuel des sessions expirées
 */
export const cleanupSessions = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await cleanupService.cleanup();
        
        const stats = await cleanupService.getSessionStats();
        
        return returnSuccess(res, {
            message: 'Nettoyage des sessions terminé',
            ...stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return returnErrorWithStatus(res, 'Erreur lors du nettoyage des sessions', 500);
    }
};

/**
 * Supprimer toutes les sessions
 */
export const clearAllSessions = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await new Promise<void>((resolve, reject) => {
            firebaseStore.clear((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        return returnSuccess(res, {
            message: 'Toutes les sessions ont été supprimées',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return returnErrorWithStatus(res, 'Erreur lors de la suppression des sessions', 500);
    }
};

/**
 * Redémarrer le service de nettoyage
 */
export const restartCleanupService = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { intervalHours } = req.body;
        const interval = intervalHours || (process.env.NODE_ENV === 'production' ? 6 : 1);
        
        cleanupService.stop();
        cleanupService.start(interval);
        
        return returnSuccess(res, {
            message: 'Service de nettoyage redémarré',
            intervalHours: interval,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return returnErrorWithStatus(res, 'Erreur lors du redémarrage du service', 500);
    }
};