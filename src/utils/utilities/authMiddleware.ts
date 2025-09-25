import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../functions/jwtService';
import { DB } from '@configs';
import { CollectionEnum, returnError } from '@utils';
import { SessionData, AuthUser } from '../types';
import { returnErrorWithStatus } from './responseHelper';

/**
 * Middleware pour vérifier l'authentification JWT
 */
export const authenticateJWT = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        // Récupérer le token depuis l'en-tête Authorization ou les cookies
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : req.cookies?.accessToken;

        if (!token) {
            return returnErrorWithStatus(res, 'Token d\'accès requis', 401);
        }

        // Vérifier le token
        const payload = JWTService.verifyAccessToken(token);
        if (!payload) {
            return returnErrorWithStatus(res, 'Token invalide ou expiré', 401);
        }

        // Vérifier la session dans la base de données
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
        
        // Vérifier si la session est valide
        if (!JWTService.isSessionValid(sessionData)) {
            return returnErrorWithStatus(res, 'Session expirée', 401);
        }

        // Mettre à jour l'activité de la session
        const updatedSession = JWTService.updateSessionActivity(sessionData);
        await sessionDoc.ref.update({
            lastActivity: updatedSession.lastActivity,
            expiresAt: updatedSession.expiresAt
        });

        // Récupérer les informations utilisateur
        const userDoc = await DB.collection(CollectionEnum.USERS).doc(payload.userId).get();
        if (!userDoc.exists) {
            return returnErrorWithStatus(res, 'Utilisateur introuvable', 401);
        }

        const userData = userDoc.data();
        const authUser: AuthUser = {
            _id: payload.userId,
            email: payload.email,
            firstname: userData?.firstname || '',
            lastname: userData?.lastname || '',
            sessionId: payload.sessionId
        };

        // Ajouter l'utilisateur à la requête
        req.user = authUser;
        
        next();
    } catch (error) {
        return returnErrorWithStatus(res, 'Erreur d\'authentification', 500);
    }
};

/**
 * Middleware pour vérifier l'authentification de session (Passport)
 */
export const authenticateSession = (
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    
    return returnErrorWithStatus(res, 'Authentification requise', 401);
};

/**
 * Middleware combiné : JWT ou Session
 */
export const authenticate = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    // Essayer d'abord l'authentification JWT
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : req.cookies?.accessToken;

    if (token) {
        return authenticateJWT(req, res, next);
    }

    // Sinon, vérifier la session Passport
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return returnErrorWithStatus(res, 'Authentification requise', 401);
};