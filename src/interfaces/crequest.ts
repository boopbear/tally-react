/* This TypeScript code snippet is defining interfaces for handling requests related to inventory
assets. Here's a breakdown of what each part is doing: */
import { BasicStatusResponse } from "../constants";
import { Attachment, IInventoryAsset, IInventoryCategory } from "./inventory";
import { IDepartment, IUser } from "./user";

export interface ICRequest {
    id: number;
    eventType: number;
    eventTitle?: string;
    assetCodeBackup?: string;
    assetDescBackup?: string;
    details?: JSON;
    isAnswered?: boolean | string;
    isApproved?: boolean | string;
    isArchived?: boolean;
    createdAt?: Date;
    requestor?: IUser;
    respondent?: IUser;
    attachments?: Attachment[];
    inventoryAsset?: IInventoryAsset;
    inventoryCategory?: IInventoryCategory;
    isHiddenAdmin?: boolean;
    isHiddenNonAdmin?: boolean;
    reasonDenied?: string;
}

export interface IFormCRequest {
    inventoryAsset?: IInventoryAsset;
    message?: string;
    getCurrentHardCopy?: "true" | "false";
    requestingUnitName?: string;
    department?: IDepartment;
    affiliation?: string;
    position?: string;
    biddingPrice?: string;
    beneficiaryName?: string;
    beneficiaryAddress?: string;
    attachments?: Attachment[];
    location?: string;
}

export interface ICRequestsResponse extends BasicStatusResponse {
    assetRequests?: ICRequest[];
}