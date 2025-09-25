import { Router } from 'express';
import {
    getSessionStats,
    cleanupSessions,
    clearAllSessions,
    restartCleanupService
} from './sessionController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionStats:
 *       type: object
 *       properties:
 *         totalSessions:
 *           type: number
 *           description: Nombre total de sessions
 *         activeSessions:
 *           type: number
 *           description: Nombre de sessions actives
 *         expiredSessions:
 *           type: number
 *           description: Nombre de sessions expirées
 *         cleanupService:
 *           type: object
 *           properties:
 *             isRunning:
 *               type: boolean
 *             intervalActive:
 *               type: boolean
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /admin/sessions/stats:
 *   get:
 *     summary: Obtenir les statistiques des sessions
 *     tags: [Admin - Sessions]
 *     description: Récupère les statistiques détaillées des sessions actives et expirées
 *     responses:
 *       '200':
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SessionStats'
 *                 statusCode:
 *                   type: number
 *       '500':
 *         description: Erreur serveur
 */
router.get('/stats', getSessionStats);

/**
 * @swagger
 * /admin/sessions/cleanup:
 *   post:
 *     summary: Forcer le nettoyage des sessions expirées
 *     tags: [Admin - Sessions]
 *     description: Lance un nettoyage manuel des sessions expirées
 *     responses:
 *       '200':
 *         description: Nettoyage terminé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     totalSessions:
 *                       type: number
 *                     activeSessions:
 *                       type: number
 *                     expiredSessions:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 statusCode:
 *                   type: number
 *       '500':
 *         description: Erreur lors du nettoyage
 */
router.post('/cleanup', cleanupSessions);

/**
 * @swagger
 * /admin/sessions/clear:
 *   delete:
 *     summary: Supprimer toutes les sessions
 *     tags: [Admin - Sessions]
 *     description: Supprime toutes les sessions de la base de données (utiliser avec précaution)
 *     responses:
 *       '200':
 *         description: Sessions supprimées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 statusCode:
 *                   type: number
 *       '500':
 *         description: Erreur lors de la suppression
 */
router.delete('/clear', clearAllSessions);

/**
 * @swagger
 * /admin/sessions/restart-cleanup:
 *   put:
 *     summary: Redémarrer le service de nettoyage
 *     tags: [Admin - Sessions]
 *     description: Redémarre le service de nettoyage automatique avec un nouvel intervalle
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               intervalHours:
 *                 type: number
 *                 description: Nouvel intervalle en heures (défaut basé sur l'environnement)
 *                 example: 6
 *     responses:
 *       '200':
 *         description: Service redémarré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     intervalHours:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 statusCode:
 *                   type: number
 *       '500':
 *         description: Erreur lors du redémarrage
 */
router.put('/restart-cleanup', restartCleanupService);

export default router;