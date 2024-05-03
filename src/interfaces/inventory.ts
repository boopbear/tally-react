/* This code snippet is defining a set of interfaces in TypeScript that represent various data
structures related to inventory assets and transactions. Here's a breakdown of what each part of the
code is doing: */
import { UploadFile } from "antd";
import { BasicStatusResponse } from "../constants";
import { IDepartment, IUser } from "./user";
import { IOptionsProp } from "./overview";

export interface Attachment extends UploadFile<any> {
    id?: number;
    uploadId?: string;
    originalFileName?: string;
    storageLink?: string;
}

export interface IDropdownItem {
    key: string;
    label?: string;
    value?: any;
}

export interface IInventoryAssetStatus {
    id: number;
    name: string;
    display?: string;
    inventoryCategoryId?: number;
}

export interface IInventoryCategory {
    id: number;
    name: string
    inventoryStatusList?: IInventoryAssetStatus[]
}

export interface IInventoryAsset {
    id: number;
    assetCode?: string;
    description?: string;
    serialNumber?: string;
    assetStatus?: IInventoryAssetStatus;
    department?: IDepartment;
    location?: string;
    owner?: string;
    endUser?: string;
    createdAt?: Date;
    dateReceived?: Date;
    poNumber?: string;
    qrKey?: string;
    isArchived?: boolean;
    sharedId?: string;
    inventoryCategory?: IInventoryCategory;
    attachments?: Attachment[];
    existingAttachments?: Attachment[];
    reasonDestroy?: string;
}

export interface IInventoryAssetImport extends IInventoryAsset {
    departmentName?: string;
    category?: string;
    status?: string;
}

export interface IInventoryCategoryOption {
    categoryOption?: IOptionsProp
    assetStatusOption?: IOptionsProp[]
}

export interface IInventoryCategoriesResponse extends BasicStatusResponse {
    inventoryCategories?: IInventoryCategory[];
}
export interface IInventoryAssetResponse extends BasicStatusResponse {
    inventoryAssets?: IInventoryAsset[];
}

export interface IFormTransactAsset {
    inventoryAsset: IInventoryAsset;
    assetStatus?: IInventoryAssetStatus;
    responsible?: IUser;
    reason?: string;
    otherReason?: string;
    remarks?: string;
    owner?: string;
    department?: IDepartment;
    location?: string;
    repairedByName?: string;
    supplierName?: string;
    beneficiaryName?: string;
    beneficiaryAddress?: string;
    pmfNo?: string;
    soldToMemberName?: string;
    soldToMemberIdNo?: string;
    soldToMemberAffiliation?: string;
    soldToMemberPosition?: string;
    salePrice?: string;
    soldReceiptNo?: string;
    scrapBuyerName?: string;
    scrapReceiptNo?: string;
    scrapSSFNo?: string;
}