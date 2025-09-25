export interface JWTPayload {
    userId: string;
    email: string;
    sessionId: string;
    type: 'access' | 'refresh';
}

export interface SessionData {
    userId: string;
    email: string;
    sessionId: string;
    lastActivity: Date;
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

export interface AuthUser {
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    sessionId: string;
}

// Extension des types Express pour inclure les sessions
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
        
        interface Session {
            userId?: string;
            sessionId?: string;
            lastActivity?: Date;
        }
    }
}