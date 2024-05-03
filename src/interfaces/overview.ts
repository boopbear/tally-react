/* This code snippet is defining a set of TypeScript interfaces and types related to a system that
manages articles, inventory, warehouse items, FAQs, and user interactions. Here's a breakdown of
what each part of the code is doing: */
import { FormInstance, SelectProps, UploadFile } from 'antd';
import { BasicStatusResponse } from '../constants';
import { Attachment, IInventoryCategoryOption } from "./inventory";
import { IDepartment, IUser } from "./user";
import { IWarehouseCategory, IWarehouseItem } from './warehouse';

export interface IOverviewTabHeaderProp {
    name: string;
    menuOnClick: () => void;
    createButtonName: string;
    createOnClick: () => void;
}

export interface IModalProps {
    title?: string;
    mainForm?: FormInstance<any>;
    initialValues?: IArticle;
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    overloadOnFinish?: () => void;
    submitting?: boolean;
    onFinish?: (values: IArticle) => void;
    onFinishFailed?: (err: any) => void;
    onCancel?: () => void;
    hasShareSelection?: boolean;
    userOptions?: SelectProps["options"];
    departmentOptions?: IOptionsProp;
    departments?: IDepartment[];
}

export interface IModalPropsInventory extends IModalProps {
    assetCategoryOptions?: IInventoryCategoryOption;
    existingUploads?: UploadFile<any>[];
    setExistingUploads?: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
}

export interface IModalPropsWarehouse extends IModalProps {
    categories?: IWarehouseCategory[];
    items?: IWarehouseItem[];
}

export interface IOption {
    key?: string;
    label: string;
    value: string;
}

export interface IOptionsProp {
    keyRef?: number;
    options?: IOption[];
    loading?: boolean
}

export interface IArticle {
    id?: number,
    title?: string,
    paragraph?: string,
    createdAt?: Date,
    publisher?: IUser,
    sharedWithUserEmails?: string[];
    attachments?: Attachment[];
}

export interface IArticleResponse extends BasicStatusResponse {
    posts?: IArticle[];
    reports?: IArticle[];
}

export interface ISearchQueryForm {
    page?: number;
    size?: number;
    keyword?: string;
    departmentId?: number;
    active?: boolean;
    startDate?: Date;
    endDate?: Date;
    orderBy?: string;
    sortBy?: string;
}

export interface ISearchInventory extends ISearchQueryForm {
    categoryId?: number;
    sharedId?: string;
    assetStatusId?: number;
    orderByRef?: string;
}

export interface ISearchWarehouse extends ISearchQueryForm {
    categoryFilterId?: number;
}

export interface ICFaq {
    id?: number;
    content?: string;
    lastUpdated?: Date;
}
export interface IFaqContentResponse extends BasicStatusResponse {
    faq?: ICFaq;
}