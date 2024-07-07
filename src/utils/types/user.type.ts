import { GenderEnum } from "../enums"

export interface User {
    _id?: string
    gender?: GenderEnum
    token?: string
    salt?: string
    firstname: string
    lastname: string
    email: string
    phone?: string
    birthDate?: Date
    city?: string
    country?: string
    password?: string
    phoneVerify?: boolean
    emailVerify?: boolean
    lastLoginAt?: Date
    createAt?: Date
}
