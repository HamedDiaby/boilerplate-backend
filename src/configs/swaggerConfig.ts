import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: `
        API Backend complète avec authentification JWT, gestion des sessions, et validation Zod.
        
        ## 🔐 Authentification
        Cette API utilise un système d'authentification hybride :
        - **JWT Tokens** : Access token (15min) et Refresh token (1 an)
        - **Sessions Express** : Sessions persistantes avec Passport.js
        - **Cookies sécurisés** : HttpOnly, Secure, SameSite
        
        ## 🛡️ Sécurité
        - Validation complète avec Zod
        - Middleware d'authentification robuste  
        - Gestion automatique de l'expiration des sessions
        - Store de session Firebase persistant
        
        ## 📱 Utilisation
        1. **Créer un compte** : \`POST /users/create-new-user\`
        2. **Se connecter** : \`POST /users/login-user\` 
        3. **Utiliser les endpoints protégés** avec le token ou la session
        4. **Rafraîchir les tokens** : \`POST /users/refresh-token\`
      `,
      contact: {
        name: 'Hamed Diaby Koumba',
        email: 'contact@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://localhost:3000',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT d\'accès'
        },
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'app.session',
          description: 'Session cookie'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            statusCode: {
              type: 'integer',
              description: 'Code de statut HTTP'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Données de réponse'
            },
            statusCode: {
              type: 'integer',
              description: 'Code de statut HTTP'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID unique de l\'utilisateur'
            },
            firstname: {
              type: 'string',
              description: 'Prénom de l\'utilisateur'
            },
            lastname: {
              type: 'string',
              description: 'Nom de l\'utilisateur'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'utilisateur'
            },
            phone: {
              type: 'string',
              description: 'Numéro de téléphone'
            },
            city: {
              type: 'string',
              description: 'Ville'
            },
            country: {
              type: 'string',
              description: 'Pays'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: 'Date de naissance'
            },
            gender: {
              type: 'string',
              enum: ['Homme', 'Femme'],
              description: 'Genre'
            },
            emailVerify: {
              type: 'boolean',
              description: 'Email vérifié'
            },
            phoneVerify: {
              type: 'boolean',
              description: 'Téléphone vérifié'
            },
            lastLoginAt: {
              type: 'string',
              format: 'date-time',
              description: 'Dernière connexion'
            },
            createAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création'
            }
          }
        },
        TokenPair: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'Token d\'accès JWT (15 minutes)'
            },
            refreshToken: {
              type: 'string',
              description: 'Token de rafraîchissement (1 an)'
            },
            expiresIn: {
              type: 'integer',
              description: 'Durée de vie du token d\'accès en secondes'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints d\'authentification (login, register, logout)'
      },
      {
        name: 'User Management', 
        description: 'Gestion du profil utilisateur'
      },
      {
        name: 'Admin - Sessions',
        description: 'Administration et monitoring des sessions'
      },
      {
        name: 'Test',
        description: 'Endpoints de test'
      }
    ]
  },
  apis: [
    './src/routes/**/*.ts',
    './src/routes/**/**/*.ts'
  ],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
