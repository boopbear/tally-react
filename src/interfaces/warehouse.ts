/* The code snippet you provided is defining a set of TypeScript interfaces related to a warehouse
management system. Here's a breakdown of what each part of the code is doing: */
import { BasicStatusResponse } from '../constants';

export interface IWarehouseTabHeaderProp {
    name: string;
    menuOnClick: Promise<void>;
    createButtonName: string;
    createOnClick: () => void;
}

export interface IWarehouseItem {
    id?: number;
    itemCode?: string;
    description?: string;
    oum?: string;
    totalQty?: number;
    remQty?: number;
    location?: string;
    pendingOrder?: string;
    poNumber?: string;
    createdAt?: Date;
    isArchived?: boolean;
    categoryId?: number;
    reasonHide?: string;
}

export interface IWarehouseCategory {
    id?: number;
    name?: string;
}

export interface IWarehouseLog {
    id?: number;
    itemCode?: string;
    description?: string;
    oum?: string;
    quantity?: number;
    dateReceived?: Date;
    affiliation?: string;
    reason?: string;
    createdAt?: Date;
    itemId?: number;
    isArchived?: boolean;
    reasonHide?: string;
}

export interface IWarehouseItemCategoriesResponse extends BasicStatusResponse {
    categories?: IWarehouseCategory[];
}

export interface IWarehouseResponse extends BasicStatusResponse {
    warehouseItems?: IWarehouseItem[];
    warehouseLogs?: IWarehouseLog[];
}