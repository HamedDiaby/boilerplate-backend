import {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    DB,
    JWTService,
} from '@configs';

import {
    CollectionEnum,
    returnErrorWithStatus, 
    returnSuccess,
    SessionData,
} from '@utils';
import { RefreshTokenSchema } from '../models';

export const refreshToken = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Récupérer le refresh token depuis les cookies ou le body
        const refreshTokenValue = req.cookies?.refreshToken || req.body.refreshToken;

        if (!refreshTokenValue) {
            return returnErrorWithStatus(res, 'Refresh token requis', 401);
        }

        // Valider le refresh token avec Zod si fourni dans le body
        if (req.body.refreshToken) {
            const validationResult = RefreshTokenSchema.safeParse({ refreshToken: refreshTokenValue });
            if (!validationResult.success) {
                return returnErrorWithStatus(res, 'Refresh token invalide', 400);
            }
        }

        // Vérifier le refresh token
        const payload = JWTService.verifyRefreshToken(refreshTokenValue);
        if (!payload) {
            return returnErrorWithStatus(res, 'Refresh token invalide ou expiré', 401);
        }

        // Vérifier si la session existe et est active
        const sessionDoc = await DB
            .collection(CollectionEnum.USERS)
            .doc(payload.userId)
            .collection('sessions')
            .doc(payload.sessionId)
            .get();

        if (!sessionDoc.exists) {
            return returnErrorWithStatus(res, 'Session invalide', 401);
        }

        const sessionData = sessionDoc.data() as SessionData;

        // Vérifier si la session est toujours valide
        if (!JWTService.isSessionValid(sessionData)) {
            return returnErrorWithStatus(res, 'Session expirée', 401);
        }

        // Générer de nouveaux tokens
        const newTokens = JWTService.generateTokenPair(
            payload.userId,
            payload.email,
            payload.sessionId
        );

        // Mettre à jour l'activité de la session
        const updatedSession = JWTService.updateSessionActivity(sessionData);
        await sessionDoc.ref.update({
            lastActivity: updatedSession.lastActivity,
            expiresAt: updatedSession.expiresAt
        });

        // Définir les nouveaux cookies
        res.cookie('accessToken', newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, // 15 minutes
            sameSite: 'lax'
        });

        res.cookie('refreshToken', newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
            sameSite: 'lax'
        });

        // Retourner les nouveaux tokens
        return returnSuccess(res, {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            expiresIn: newTokens.expiresIn
        });

    } catch (error) {
        return returnErrorWithStatus(res, 'Erreur lors du rafraîchissement du token', 500);
    }
};