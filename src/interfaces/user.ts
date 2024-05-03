/* This code snippet is defining a set of TypeScript interfaces related to user management and
department information in an application. Here's a breakdown of what each part does: */
import { BasicStatusResponse } from "../constants";
import { Attachment } from "./inventory";

export interface IUser {
    id: number;
    email?: string;
    googleId?: string;
    sharedId?: string;
    createdAt?: Date;
    role?: "SUPER_ADMIN" | "OFFICE_ADMIN";
    customSettingsData?: IUserCustomSetttingsData;
    profile?: IUserProfile;
    department?: IDepartment;
    isArchived?: boolean;
    reasonHide?: string;
}

export interface IUserProfile {
    id: number;
    givenName?: string;
    familyName?: string;
    fullName?: string;
    birthDate?: Date;
    employeeNumber?: string;
    userId?: number;
    profilePic?: Attachment;
}

export interface IDepartment {
    id: number,
    name?: string
    isArchived?: boolean;
    location?: string;
    reasonHide?: string;
}

// for json, values are stored in mysql as string
export interface IUserCustomSetttingsData {
    hasCurrentInventoryAccess?: "true" | "false";
    hasTurnOverAssetPermission?: "true" | "false";
    hasPurchaseAssetPermission?: "true" | "false";
    hasDonationAssetPermission?: "true" | "false";
}

export interface IUsersResponse extends BasicStatusResponse {
    users?: IUser[];
}

export interface IDepartmentsResponse extends BasicStatusResponse {
    departments?: IDepartment[];
}

export interface IUsersInfoResponse extends BasicStatusResponse {
    user?: IUser;
}