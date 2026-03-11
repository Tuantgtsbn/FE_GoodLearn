export enum EUserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export interface IRole {
    id: string;
    name: EUserRole;
    prefix: string;
}

export enum EUserGender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

interface IAuthentication {
    userId: string;
    googleId?: string;
    facebookId?: string;
    lastLogin?: string;
    isVerified: boolean;
    createdAt: string;
}

export interface IAddress {
    id: string;
    detail: string;
    ward: string;
    district?: string;
    city: string;
    country: string;
    user?: IUser | null;
}

export interface ISession {
    id: string;
    userId: string;
    user?: IUser;
    expiresAt: string;
    createdAt: string;
}

export interface IName {
    userId: string;
    firstName: string;
    lastName: string;
}

export interface IUser {
    id: string;
    username: string;
    email: string;
    citizen_id?: string;
    password?: string | null;
    avatar: string;
    roleId: number;
    role: IRole;
    birthday?: string | null;
    gender: EUserGender;
    phone?: string | null;
    addressId?: string | null;
    nameId?: string | null;
    authentication?: IAuthentication;
    createdAt: string;
    updatedAt: string;
    address?: IAddress;
    sessions?: ISession[];
    name: IName | null;
}

export interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}