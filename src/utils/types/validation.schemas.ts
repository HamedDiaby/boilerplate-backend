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
    currentPassword: z.string()
        .min(6, 'Le mot de passe actuel doit contenir au moins 6 caractères'),
    newPassword: z.string()
        .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
        .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
});

// Types inférés des schémas
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;