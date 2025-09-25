import { Response } from 'express';

/**
 * Fonction pour retourner une erreur avec un code de statut personnalisé
 */
export const returnErrorWithStatus = (res: Response, message: string, statusCode: number = 500): void => {
    res.status(statusCode).json({ 
        error: message,
        statusCode 
    });
};

/**
 * Fonction pour retourner une réponse de succès
 */
export const returnSuccess = (res: Response, data: any, statusCode: number = 200): void => {
    res.status(statusCode).json({
        success: true,
        data,
        statusCode
    });
};