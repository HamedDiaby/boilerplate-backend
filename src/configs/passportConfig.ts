import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { DB } from '@configs';
import { CollectionEnum, User, encodedString } from '@utils';

const { hashPassword } = encodedString();

// Configuration de la stratégie locale
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email: string, password: string, done) => {
    try {
        // Rechercher l'utilisateur dans la base de données
        const snapshot = await DB.collection(CollectionEnum.USERS)
            .where('email', '==', email)
            .get();

        if (snapshot.empty) {
            return done(null, false, { message: 'Email ou mot de passe incorrect' });
        }

        let user: User | null = null;
        let docId: string = '';

        snapshot.forEach(doc => {
            const userData = doc.data() as User;
            const passwordVerify = hashPassword(password, userData.salt!);

            if (passwordVerify === userData.password) {
                user = userData;
                docId = doc.id;
            }
        });

        if (!user) {
            return done(null, false, { message: 'Email ou mot de passe incorrect' });
        }

        // Retourner l'utilisateur avec son ID de document
        const userWithId = Object.assign({}, user, { _id: docId });
        return done(null, userWithId);

    } catch (error) {
        return done(error);
    }
}));

// Sérialisation de l'utilisateur pour la session
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

// Désérialisation de l'utilisateur depuis la session
passport.deserializeUser(async (id: string, done) => {
    try {
        const doc = await DB.collection(CollectionEnum.USERS).doc(id).get();
        
        if (!doc.exists) {
            return done(null, false);
        }

        const user = doc.data() as User;
        const userWithId = Object.assign({}, user, { _id: doc.id });
        done(null, userWithId);
    } catch (error) {
        done(error);
    }
});

export default passport;