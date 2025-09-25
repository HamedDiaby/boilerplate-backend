# 🚀 Talendy Backend API

Une API backend robuste construite avec Node.js, Express, TypeScript, et Firebase, intégrant un système d'authentification avancé avec JWT, sessions, et validation Zod.

## 📋 Table des Matières

- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies](#️-technologies)
- [⚡ Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🚀 Démarrage](#-démarrage)
- [🔐 Authentification](#-authentification)
- [🔄 Gestion des Sessions](#-gestion-des-sessions)
- [📱 Intégration Frontend](#-intégration-frontend)
- [📚 API Documentation](#-api-documentation)
- [🧪 Tests](#-tests)

## 🏗️ Architecture

```
src/
├── app.ts                     # Point d'entrée de l'application
├── bin/
│   └── www.ts                # Serveur HTTP
├── configs/                   # Configuration centralisée
│   ├── dbConfigs/            # Configuration Firebase
│   ├── session/              # Configuration d'authentification
│   │   ├── authMiddleware.ts # Middleware d'authentification
│   │   ├── jwtService.ts     # Service JWT
│   │   ├── passportConfig.ts # Configuration Passport
│   │   └── sessionConfig.ts  # Configuration des sessions
│   ├── swaggerConfig.ts      # Configuration Swagger
│   └── index.ts
├── routes/                    # Routes de l'API
│   ├── test.route.ts         # Routes de test
│   └── users/                # Module utilisateurs
│       ├── controllers/      # Contrôleurs
│       ├── models/           # Modèles de validation
│       ├── utils/           # Utilitaires spécifiques
│       └── router.ts        # Routeur principal
└── utils/                    # Utilitaires globaux
    ├── enums/               # Énumérations
    ├── functions/           # Fonctions utilitaires
    ├── messagesTemplate/    # Templates d'emails
    ├── types/              # Types TypeScript
    └── utilities/          # Utilitaires divers
```

## 🛠️ Technologies

### **Core**
- **Node.js** + **Express.js** - Framework web
- **TypeScript** - Typage statique
- **Firebase Admin SDK** - Base de données et authentification
- **Webpack** - Build et bundling

### **Authentification & Sécurité**
- **JWT (jsonwebtoken)** - Tokens d'accès et de rafraîchissement
- **Passport.js** + **passport-local** - Stratégies d'authentification
- **express-session** - Gestion des sessions
- **Zod** - Validation des données
- **crypto-js** - Chiffrement et hachage

### **Utilitaires**
- **Nodemailer** - Envoi d'emails
- **Morgan** - Logging HTTP
- **Swagger** - Documentation API
- **CORS** - Gestion des origines croisées
- **UUID** - Génération d'identifiants uniques

## ⚡ Installation

### Prérequis
- Node.js (≥ 16.x)
- npm ou yarn
- Compte Firebase avec Firestore activé

### Installation des dépendances

```bash
# Cloner le repository
git clone <repository-url>
cd talendy-backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

## 🔧 Configuration

### 1. Variables d'environnement (.env)

```env
# Configuration Firebase
FIREBASE_project_id=votre-project-id
FIREBASE_private_key="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_client_email=firebase-admin@votre-project.iam.gserviceaccount.com

# Configuration Email
NODE_MAILER_EMAIL=votre-email@gmail.com
NODE_MAILER_PASSWORD=votre-mot-de-passe-application

# Configuration JWT
JWT_ACCESS_SECRET=votre-secret-access-token-securise
JWT_REFRESH_SECRET=votre-secret-refresh-token-securise

# Configuration Sessions
SESSION_SECRET=votre-secret-session-securise

# Environnement
NODE_ENV=development
```

### 2. Configuration Firebase

1. Créer un projet Firebase
2. Activer Firestore Database
3. Créer un compte de service :
   - Console Firebase → Paramètres → Comptes de service
   - Générer une nouvelle clé privée
   - Copier les valeurs dans `.env`

### 3. Configuration Email

Pour Gmail :
1. Activer l'authentification à 2 facteurs
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `NODE_MAILER_PASSWORD`

## 🚀 Démarrage

### Développement

```bash
# Démarrer en mode développement
npm run dev

# L'API sera disponible sur http://localhost:3000
```

### Production

```bash
# Build de production
npm run build

# Démarrer l'application
npm start
```

### Documentation API

L'API Swagger est disponible sur : `http://localhost:3000/api-docs`

## 🔐 Authentification

### Architecture d'Authentification

Le système utilise une **double authentification** :

1. **Sessions Express + Passport** - Authentication traditionnelle
2. **JWT (Access + Refresh tokens)** - Authentication stateless

### Flow d'Authentification

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as Database
    
    C->>A: POST /users/login-user
    A->>DB: Vérifier credentials
    A->>A: Créer session Passport
    A->>A: Générer JWT tokens
    A->>DB: Sauvegarder session
    A->>C: Retourner tokens + cookies
```

### Endpoints d'Authentification

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/users/create-new-user` | POST | Créer un compte |
| `/users/login-user` | POST | Se connecter |
| `/users/logout` | POST | Se déconnecter |
| `/users/refresh-token` | POST | Rafraîchir les tokens |
| `/users/user-verify-email` | PUT | Vérifier l'email |

### Sécurité des Tokens

- **Access Token** : 15 minutes, pour les requêtes API
- **Refresh Token** : 1 an, pour renouveler l'access token
- **Session** : 1 an, se renouvelle à chaque activité
- **Cookies** : HttpOnly, Secure (HTTPS), SameSite

## 🔄 Gestion des Sessions

### Configuration des Sessions

```typescript
{
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Renouvelle à chaque requête
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
    sameSite: 'lax'
  }
}
```

### Stockage des Sessions

- **Express Session** : En mémoire (développement)
- **Firebase** : Stockage persistent des métadonnées de session
- **Recommandation** : Utiliser Redis ou MongoDB pour la production

### Middleware d'Authentification

Trois niveaux de protection disponibles :

```typescript
// JWT uniquement
app.use('/api/protected', authenticateJWT);

// Session Passport uniquement  
app.use('/api/session', authenticateSession);

// JWT ou Session (flexible)
app.use('/api/hybrid', authenticate);
```

## 📱 Intégration Frontend

### 🌐 Setup Initial

```javascript
// Configuration de base
const API_BASE_URL = 'http://localhost:3000';

// Configuration Axios avec credentials
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;
```

### 🔑 Authentification côté Frontend

#### 1. **Connexion Utilisateur**

```javascript
// Login avec gestion automatique des cookies
const login = async (email, password) => {
  try {
    const response = await axios.post('/users/login-user', {
      email,
      password
    });
    
    const { user, tokens } = response.data.data;
    
    // Les cookies sont automatiquement définis par le serveur
    // Optionnel : stocker les tokens en localStorage pour usage explicite
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Erreur de connexion' 
    };
  }
};
```

#### 2. **Intercepteur Axios pour Tokens**

```javascript
// Intercepteur pour ajouter le token automatiquement
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer l'expiration des tokens
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Essayer de rafraîchir le token
      try {
        const refreshResponse = await axios.post('/users/refresh-token');
        const { accessToken } = refreshResponse.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        
        // Retry la requête originale
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        // Rediriger vers login si refresh échoue
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

#### 3. **Context React pour l'Authentification**

```jsx
// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si utilisateur connecté au chargement
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await loginAPI(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    try {
      await axios.post('/users/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      localStorage.clear();
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### 4. **Composant de Protection de Routes**

```jsx
// ProtectedRoute.jsx
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

#### 5. **Gestion des États de Session**

```javascript
// SessionManager.js
export class SessionManager {
  static SESSION_KEY = 'user_session';
  static TOKEN_KEY = 'access_token';

  static setSession(user, tokens) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
  }

  static getSession() {
    const user = localStorage.getItem(this.SESSION_KEY);
    return user ? JSON.parse(user) : null;
  }

  static clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isSessionValid() {
    return !!this.getSession() && !!this.getToken();
  }
}
```

### 🔧 Configuration CORS côté Backend

Le backend est configuré pour accepter les requêtes depuis votre frontend :

```javascript
// Dans app.ts - Configuration CORS
const allowedOrigins = [
  'http://localhost:3000',  // React dev server
  'http://localhost:3001',  // Alternative port
  'https://votre-domaine.com' // Production
];
```

### 📱 Exemples d'Usage Frontend

#### **Requête Protégée**

```javascript
// Requête automatique avec cookies et headers
const getUserProfile = async () => {
  try {
    const response = await axios.get('/users/profile');
    return response.data.data;
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    throw error;
  }
};
```

#### **Mise à Jour du Profil**

```javascript
const updateProfile = async (profileData) => {
  try {
    const response = await axios.put('/users/user-updated-infos', {
      token: user.token, // Si nécessaire
      ...profileData
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

### 🚨 **Points Importants**

1. **Cookies Automatiques** : Les tokens sont gérés automatiquement via cookies HttpOnly
2. **Fallback localStorage** : Tokens disponibles en localStorage pour usage explicite
3. **Refresh Automatique** : L'intercepteur gère automatiquement le renouvellement
4. **Sécurité** : Cookies sécurisés (HttpOnly, Secure, SameSite)
5. **Expiration** : Session d'1 an qui se renouvelle à chaque activité

Cette architecture offre **flexibilité** et **sécurité** pour tous types d'applications frontend (React, Vue, Angular, Mobile).

## 📚 API Documentation

### Validation des Données

Tous les endpoints utilisent la validation Zod :

```typescript
// Exemple de schéma
const LoginSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères')
});
```

### Réponses Standardisées

```typescript
// Succès
{
  success: true,
  data: { ... },
  statusCode: 200
}

// Erreur
{
  error: "Message d'erreur",
  statusCode: 400
}
```

### Endpoints Principaux

#### Utilisateurs
- `POST /users/create-new-user` - Créer un compte
- `POST /users/login-user` - Se connecter  
- `POST /users/logout` - Se déconnecter
- `POST /users/refresh-token` - Rafraîchir les tokens
- `PUT /users/user-updated-password` - 🔒 Changer le mot de passe
- `PUT /users/user-updated-infos` - 🔒 Mettre à jour le profil
- `DELETE /users/user-delete-account` - 🔒 Supprimer le compte
- `PUT /users/user-verify-email` - Vérifier l'email

🔒 = Authentification requise

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage
```

## 📈 Monitoring et Logs

- **Morgan** : Logs HTTP automatiques
- **Console.error** : Logs d'erreurs serveur
- **Swagger** : Monitoring des endpoints

## 🚀 Déploiement

### Preparation

1. Configurer les variables d'environnement de production
2. Mettre à jour les origines CORS autorisées
3. Configurer un store de session persistent (Redis/MongoDB)

### Build

```bash
npm run build
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)  
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 👥 Auteur

**Hamed Diaby Koumba**

---

💡 **Note** : Cette API est conçue pour être évolutive et modulaire. Chaque module peut être étendu facilement sans impacter les autres parties du système.