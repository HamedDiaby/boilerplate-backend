import {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    DB,
} from '@configs';

import {
    CollectionEnum,
    JWTService,
} from '@utils';

import { returnErrorWithStatus, returnSuccess } from '../../utils/utilities/responseHelper';

export const logoutUser = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = req.user as any; // Utiliser any pour éviter les erreurs de type
        
        if (!user || !user.sessionId) {
            return returnErrorWithStatus(res, 'Aucune session active', 400);
        }

        // Révoquer la session dans la base de données
        const sessionDoc = await DB
            .collection(CollectionEnum.USERS)
            .doc(user._id)
            .collection('sessions')
            .doc(user.sessionId)
            .get();

        if (sessionDoc.exists) {
            await sessionDoc.ref.update({
                isActive: false,
                loggedOutAt: new Date()
            });
        }

        // Déconnecter l'utilisateur de la session Passport
        req.logout((err) => {
            if (err) {
                console.error('Erreur lors de la déconnexion Passport:', err);
            }
        });

        // Supprimer les cookies de tokens
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        
        // Détruire la session Express
        req.session.destroy((err) => {
            if (err) {
                console.error('Erreur lors de la destruction de la session:', err);
            }
        });

        return returnSuccess(res, { message: 'Déconnexion réussie' });

    } catch (error) {
        return returnErrorWithStatus(res, 'Erreur lors de la déconnexion', 500);
    }
};