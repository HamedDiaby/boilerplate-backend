import { DB, JWTService } from '@configs';
import passport from 'passport';

import {
    Request, 
    Response, 
    NextFunction,
} from 'express';

import { 
    CollectionEnum,
    User, 
    returnErrorWithStatus,
    returnSuccess,
    LoginSchema,
} from '@utils';

export const loginUser = async(
    req: Request, 
    res: Response, 
    next: NextFunction,
)=> {
    try {
        // Validation des données avec Zod
        const validationResult = LoginSchema.safeParse(req.body);
        if (!validationResult.success) {
            return returnErrorWithStatus(res, 'Données invalides: ' + validationResult.error.issues.map(i => i.message).join(', '), 400);
        }

        // Utiliser Passport pour l'authentification
        passport.authenticate('local', async (err: any, user: User & { _id: string }, info: any) => {
            if (err) {
                return returnErrorWithStatus(res, err, 500);
            }

            if (!user) {
                return returnErrorWithStatus(res, info?.message || 'Email ou mot de passe incorrect', 401);
            }

            // Connecter l'utilisateur (créer une session)
            req.logIn(user, async (loginErr) => {
                if (loginErr) {
                    return returnErrorWithStatus(res, loginErr, 500);
                }

                try {
                    // Générer un nouveau sessionId
                    const sessionId = JWTService.generateSessionId();
                    
                    // Générer les tokens JWT
                    const tokens = JWTService.generateTokenPair(user._id, user.email, sessionId);
                    
                    // Créer les données de session
                    const sessionData = JWTService.createSessionData(user._id, user.email, sessionId);
                    
                    // Sauvegarder la session dans Firebase
                    await DB
                        .collection(CollectionEnum.USERS)
                        .doc(user._id)
                        .collection('sessions')
                        .doc(sessionId)
                        .set(sessionData);

                    // Mettre à jour la dernière connexion
                    await DB
                        .collection(CollectionEnum.USERS)
                        .doc(user._id)
                        .update({
                            lastLoginAt: new Date()
                        });

                    // Définir les cookies sécurisés
                    res.cookie('accessToken', tokens.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 15 * 60 * 1000, // 15 minutes
                        sameSite: 'lax'
                    });

                    res.cookie('refreshToken', tokens.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
                        sameSite: 'lax'
                    });

                    // Réponse de succès
                    const userResponse = {
                        _id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        phone: user.phone,
                        city: user.city,
                        country: user.country,
                        emailVerify: user.emailVerify,
                        phoneVerify: user.phoneVerify,
                        sessionId
                    };

                    return returnSuccess(res, {
                        user: userResponse,
                        tokens: {
                            accessToken: tokens.accessToken,
                            refreshToken: tokens.refreshToken,
                            expiresIn: tokens.expiresIn
                        }
                    });

                } catch (sessionError) {
                    return returnErrorWithStatus(res, 'Erreur lors de la création de la session', 500);
                }
            });
        })(req, res, next);

    } catch (error) {
        return returnErrorWithStatus(res, 'Internal Server Error', 500);
    }
};
