import { PathsEnum } from '@utils';
import { Router } from 'express';

import { createUser } from './createUser';
import { verifyUserEmail } from './verifyUserEmail';
import { loginUser } from './loginUser';
import { updateUserPassword } from './updateUserPassword';
import { updateUserInfos } from './updateUserInfos';
import { deleteUserAccount } from './deleteUserAccount';

const router = Router();

/* POST create user. */
/**
 * @swagger
 * /users/create-new-user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     description: This endpoint allows you to create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       '200':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
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
router.post(PathsEnum.CREATE_NEW_USER, createUser);

/* PUT verify user email */
/**
 * @swagger
 * components:
 *   schemas:
 *     VerifyEmailRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         otp:
 *           type: string
 *       required:
 *         - token
 *         - otp
 *     VerifyEmailResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

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
router.put(PathsEnum.USER_VERIFY_EMAIL, verifyUserEmail);

/* POST login user */
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
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
 */

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

/* PUT updated user password */
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePasswordRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         newPassword:
 *           type: string
 *       required:
 *         - token
 *         - newPassword
 *     UpdatePasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

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
router.put(PathsEnum.USER_UPDATED_PASSWORD, updateUserPassword);

/* PUT updated user infos */
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserInfosRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *       required:
 *         - token
 *     UpdateUserInfosResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

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
router.put(PathsEnum.USER_UPDATED_INFOS, updateUserInfos);

/* DELETE user */
/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteUserAccountRequest:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *       required:
 *         - token
 *     DeleteUserAccountResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

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
router.delete(PathsEnum.USER_DELETED_ACCOUNT, deleteUserAccount);

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
 */

export default router;