import { z } from 'zod';

// Schema de validation pour le login
export const LoginSchema = z.object({
    email: z.string()
        .email('Format d\'email invalide')
        .min(1, 'Email requis'),
    password: z.string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
        .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
});

// Schema de validation pour la création d'utilisateur
export const CreateUserSchema = z.object({
    firstname: z.string()
        .min(1, 'Prénom requis')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
    lastname: z.string()
        .min(1, 'Nom requis')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    email: z.string()
        .email('Format d\'email invalide')
        .min(1, 'Email requis'),
    password: z.string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
        .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères'),
    phone: z.string().optional(),
    birthDate: z.date().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    gender: z.enum(['Homme', 'Femme']).optional()
});

// Schema pour la validation du refresh token
export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token requis')
});

// Schema pour la mise à jour du mot de passe
export const UpdatePasswordSchema = z.object({
    token: z.string().min(1, 'Token requis'),
    newPassword: z.string()
        .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
        .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
});

// Schema pour la vérification d'email
export const VerifyEmailSchema = z.object({
    token: z.string().min(1, 'Token requis'),
    otp: z.string()
        .min(1, 'Code OTP requis')
        .max(10, 'Code OTP invalide')
});

// Schema pour la mise à jour des informations utilisateur
export const UpdateUserInfosSchema = z.object({
    token: z.string().min(1, 'Token requis'),
    firstname: z.string()
        .min(1, 'Le prénom ne peut pas être vide')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
        .optional(),
    lastname: z.string()
        .min(1, 'Le nom ne peut pas être vide')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères')
        .optional(),
    city: z.string()
        .max(100, 'La ville ne peut pas dépasser 100 caractères')
        .optional(),
    country: z.string()
        .max(100, 'Le pays ne peut pas dépasser 100 caractères')
        .optional(),
    birthDate: z.date()
        .optional()
});

// Schema pour la suppression de compte
export const DeleteUserAccountSchema = z.object({
    token: z.string().min(1, 'Token requis')
});

// Types inférés des schémas
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type UpdateUserInfosInput = z.infer<typeof UpdateUserInfosSchema>;
export type DeleteUserAccountInput = z.infer<typeof DeleteUserAccountSchema>;