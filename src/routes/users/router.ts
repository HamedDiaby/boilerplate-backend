import { PathsEnum } from '@utils';
import { Router } from 'express';
import { authenticate } from '@configs';
import {
    createUser,
    verifyUserEmail,
    loginUser,
    updateUserPassword,
    updateUserInfos,
    deleteUserAccount,
    refreshToken,
    logoutUser,
} from './controllers';

const router = Router();

/**
 * @swagger
 * /users/create-new-user:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     tags: [Authentication]
 *     description: |
 *       Crée un nouveau compte utilisateur avec validation complète des données.
 *       - Validation Zod des champs obligatoires et optionnels
 *       - Vérification de l'unicité de l'email
 *       - Génération automatique d'un token utilisateur
 *       - Envoi d'un email de confirmation avec code OTP
 *       - Hachage sécurisé du mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       '201':
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: Token utilisateur
 *                         message:
 *                           type: string
 *                           example: "Utilisateur créé avec succès - Email de confirmation envoyé"
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       '400':
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(PathsEnum.CREATE_NEW_USER, createUser);

/**
 * @swagger
 * /users/login-user:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentication]
 *     description: |
 *       Authentifie un utilisateur et crée une session complète.
 *       - Authentification via Passport.js avec stratégie locale
 *       - Génération de tokens JWT (access + refresh)
 *       - Création de session Express persistante
 *       - Stockage sécurisé des tokens dans des cookies HttpOnly
 *       - Mise à jour de la date de dernière connexion
 *       - Session d'1 an avec renouvellement automatique
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Connexion réussie
 *         headers:
 *           Set-Cookie:
 *             description: Cookies sécurisés pour les tokens
 *             schema:
 *               type: string
 *               example: "accessToken=jwt_token; HttpOnly; Secure; SameSite=Lax"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Email ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(PathsEnum.LOGIN_USER, loginUser);

/**
 * @swagger
 * /users/user-verify-email:
 *   put:
 *     summary: Verify user email
 *     tags: [User]
 *     description: This endpoint allows a user to verify their email address using a token and OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       '200':
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyEmailResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @swagger
 * /users/user-verify-email:
 *   put:
 *     summary: Vérifier l'adresse email
 *     tags: [Authentication]
 *     description: |
 *       Vérifie l'adresse email d'un utilisateur avec un code OTP.
 *       - Validation du token utilisateur et du code OTP
 *       - Vérification de la correspondance OTP/utilisateur
 *       - Suppression automatique de l'OTP après vérification
 *       - Marque l'email comme vérifié dans le profil utilisateur
 *       - Validation Zod des données d'entrée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *     responses:
 *       '200':
 *         description: Email vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Email vérifié !"
 *       '400':
 *         description: Données invalides ou code OTP incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la vérification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(PathsEnum.USER_VERIFY_EMAIL, verifyUserEmail);

/**
 * @swagger
 * /users/login-user:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     description: This endpoint allows a user to login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post(PathsEnum.LOGIN_USER, loginUser);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [User]
 *     description: This endpoint allows refreshing an expired access token using a refresh token.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *       '401':
 *         description: Invalid or expired refresh token
 *       '500':
 *         description: Internal server error
 */
router.post(PathsEnum.REFRESH_TOKEN, refreshToken);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [User]
 *     description: This endpoint allows a user to logout and invalidate their session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       '401':
 *         description: Authentication required
 *       '500':
 *         description: Internal server error
 */
router.post(PathsEnum.LOGOUT_USER, authenticate, logoutUser);

/**
 * @swagger
 * /users/user-updated-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     description: This endpoint allows a user to update their password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatePasswordResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @swagger
 * /users/user-updated-password:
 *   put:
 *     summary: Mettre à jour le mot de passe
 *     tags: [User Management]
 *     description: |
 *       Met à jour le mot de passe d'un utilisateur authentifié.
 *       - Validation du token utilisateur
 *       - Validation Zod du nouveau mot de passe (6-100 caractères)
 *       - Génération d'un nouveau sel de sécurité
 *       - Hachage sécurisé du nouveau mot de passe
 *       - Génération d'un nouveau token utilisateur
 *       - Authentification requise
 *     security:
 *       - bearerAuth: []
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       '200':
 *         description: Mot de passe mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Mot de passe mis à jour !"
 *       '400':
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Authentification requise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Erreur lors de la mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(PathsEnum.USER_UPDATED_PASSWORD, authenticate, updateUserPassword);

/**
 * @swagger
 * /users/user-updated-infos:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     description: This endpoint allows a user to update their personal information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInfosRequest'
 *     responses:
 *       '200':
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserInfosResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put(PathsEnum.USER_UPDATED_INFOS, authenticate, updateUserInfos);

/**
 * @swagger
 * /users/user-delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     description: This endpoint allows a user to delete their account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserAccountRequest'
 *     responses:
 *       '200':
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserAccountResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete(PathsEnum.USER_DELETED_ACCOUNT, authenticate, deleteUserAccount);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         gender:
 *           type: string
 *         token:
 *           type: string
 *         salt:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         password:
 *           type: string
 *         phoneVerify:
 *           type: boolean
 *         emailVerify:
 *           type: boolean
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *         createAt:
 *           type: string
 *           format: date-time
 *     CreateUserRequest:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         message:
 *           type: string
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *       properties:
 *         firstname:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Prénom de l'utilisateur
 *           example: "Jean"
 *         lastname:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Nom de l'utilisateur
 *           example: "Dupont"
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *           example: "jean.dupont@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 100
 *           description: Mot de passe (6-100 caractères)
 *           example: "motdepasse123"
 *         phone:
 *           type: string
 *           description: Numéro de téléphone (optionnel)
 *           example: "+33123456789"
 *         city:
 *           type: string
 *           description: Ville (optionnel)
 *           example: "Paris"
 *         country:
 *           type: string
 *           description: Pays (optionnel)
 *           example: "France"
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Date de naissance (optionnel)
 *           example: "1990-01-15"
 *         gender:
 *           type: string
 *           enum: ['Homme', 'Femme']
 *           description: Genre (optionnel)
 *           example: "Homme"
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *           example: "jean.dupont@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Mot de passe
 *           example: "motdepasse123"
 * 
 *     VerifyEmailRequest:
 *       type: object
 *       required:
 *         - token
 *         - otp
 *       properties:
 *         token:
 *           type: string
 *           description: Token de l'utilisateur
 *           example: "uuid-token-string"
 *         otp:
 *           type: string
 *           minLength: 1
 *           maxLength: 10
 *           description: Code OTP reçu par email
 *           example: "123456"
 * 
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Token de l'utilisateur
 *           example: "uuid-token-string"
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           maxLength: 100
 *           description: Nouveau mot de passe
 *           example: "nouveaumotdepasse123"
 * 
 *     UpdateUserInfosRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Token de l'utilisateur
 *           example: "uuid-token-string"
 *         firstname:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Nouveau prénom (optionnel)
 *           example: "Jean"
 *         lastname:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Nouveau nom (optionnel)
 *           example: "Martin"
 *         city:
 *           type: string
 *           maxLength: 100
 *           description: Nouvelle ville (optionnel)
 *           example: "Lyon"
 *         country:
 *           type: string
 *           maxLength: 100
 *           description: Nouveau pays (optionnel)
 *           example: "France"
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Nouvelle date de naissance (optionnel)
 *           example: "1990-01-15"
 * 
 *     RefreshTokenRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Token de rafraîchissement (optionnel si présent dans les cookies)
 *           example: "jwt-refresh-token-string"
 * 
 *     DeleteAccountRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Token de l'utilisateur
 *           example: "uuid-token-string"
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             tokens:
 *               $ref: '#/components/schemas/TokenPair'
 *         statusCode:
 *           type: integer
 *           example: 200
 */

export default router;