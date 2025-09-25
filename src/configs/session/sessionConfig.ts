import session from 'express-session';

// Configuration des sessions
export const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'session_secret_change_in_production',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Renouvelle la session à chaque requête
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
        sameSite: 'lax'
    },
    name: 'talendy.session'
};