import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload, TokenPair, SessionData } from '@utils';

// Configuration JWT
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret_key_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_change_in_production';

// Durées des tokens
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '365d'; // 1 an
const SESSION_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 an en milliseconds

export class JWTService {
    /**
     * Génère une nouvelle session avec un ID unique
     */
    static generateSessionId(): string {
        return uuidv4();
    }

    /**
     * Génère une paire de tokens (access + refresh)
     */
    static generateTokenPair(userId: string, email: string, sessionId: string): TokenPair {
        const accessPayload: JWTPayload = {
            userId,
            email,
            sessionId,
            type: 'access'
        };

        const refreshPayload: JWTPayload = {
            userId,
            email,
            sessionId,
            type: 'refresh'
        };

        const accessToken = jwt.sign(accessPayload, JWT_ACCESS_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
            issuer: 'talendy-backend',
            audience: 'talendy-client'
        });

        const refreshToken = jwt.sign(refreshPayload, JWT_REFRESH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
            issuer: 'talendy-backend',
            audience: 'talendy-client'
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: 15 * 60, // 15 minutes en secondes
            refreshExpiresIn: 365 * 24 * 60 * 60 // 1 an en secondes
        };
    }

    /**
     * Vérifie et décode un access token
     */
    static verifyAccessToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
                issuer: 'talendy-backend',
                audience: 'talendy-client'
            }) as JWTPayload;

            if (decoded.type !== 'access') {
                return null;
            }

            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Vérifie et décode un refresh token
     */
    static verifyRefreshToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
                issuer: 'talendy-backend',
                audience: 'talendy-client'
            }) as JWTPayload;

            if (decoded.type !== 'refresh') {
                return null;
            }

            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Crée les données de session
     */
    static createSessionData(userId: string, email: string, sessionId: string): SessionData {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + SESSION_EXPIRY);

        return {
            userId,
            email,
            sessionId,
            lastActivity: now,
            createdAt: now,
            expiresAt,
            isActive: true
        };
    }

    /**
     * Met à jour l'activité de la session
     */
    static updateSessionActivity(sessionData: SessionData): SessionData {
        const now = new Date();
        const newExpiresAt = new Date(now.getTime() + SESSION_EXPIRY);

        return {
            ...sessionData,
            lastActivity: now,
            expiresAt: newExpiresAt
        };
    }

    /**
     * Vérifie si une session est valide
     */
    static isSessionValid(sessionData: SessionData): boolean {
        const now = new Date();
        return sessionData.isActive && sessionData.expiresAt > now;
    }

    /**
     * Révoque une session
     */
    static revokeSession(sessionData: SessionData): SessionData {
        return {
            ...sessionData,
            isActive: false
        };
    }
}