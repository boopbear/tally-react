/* This TypeScript code is defining interfaces related to logging functionality in an inventory
management system. Here's a breakdown of what it's doing: */
import { BasicStatusResponse, EnInventoryCategories } from "../constants";
import { IInventoryAsset, IInventoryAssetStatus, IInventoryCategory } from "./inventory";
import { IUser } from "./user";

export interface ILogs {
    id: number;
    assetCodeBackup?: string;
    eventTitle?: string;
    details?: JSON;
    createdAt?: Date;
    responsible?: IUser;
    inventoryCategory?: IInventoryCategory;
    assetStatus?: IInventoryAssetStatus;
    inventoryAsset?: IInventoryAsset;
}

export interface ILogsResponse extends BasicStatusResponse {
    assetLogs?: ILogs[];
}