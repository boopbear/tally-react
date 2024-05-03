import { IOption } from "./interfaces/overview";

export enum EnInventoryCategories {
    CURRENT = "Current",
    OUTGOING = "Outgoing",
}

export enum EnInventoryAssetStatus {
    TRANSFER = "Transfer",
    REPAIR = "Repair",
    TRADEIN = "Trade-in",
    PULLOUT = "Pull-out",
    TURNOVER = "Turnover",
    RETURNTOSUPPLIER = "Return to Supplier",
    SALE = "Sale",
    DONATE = "Donate",
    SCRAP = "Scrap",
    DISPOSAL = "Disposal",
    SAFEKEEPING = "Safekeeping",
}

export enum EnOrderBy {
    ASC = "Ascending",
    DESC = "Descending"
}

export enum EnQRStatus {
    NOTGENERATED = "QR Not Generated",
    GENERATED = "QR Generated"
}

export const RES_STATUS = {
    success: "success",
    fail: "fail",
    error: "error"
};

export interface BasicStatusResponse {
    status?: string;
    message?: string;
    error?: any;
}

export const OTHERS = "Others";

export const reasonOptions: IOption[] = [
    { key: "1", label: "Broken/Obsolete", value: "Broken/Obsolete" },
    { key: "2", label: "Idle (in working condition)", value: "Idle (in working condition)" },
    { key: "3", label: "For Donation", value: "For Donation" },
    { key: "4", label: "For Disposal", value: "For Disposal" },
    { key: "5", label: "For Borrowing", value: "For Borrowing" },
    { key: "6", label: "For Repair", value: "For Repair" },
    { key: "7", label: "For Replacement", value: "For Replacement" },
    { key: "8", label: OTHERS, value: OTHERS },
]

export const LOGIN_DETAILS_LOCAL = "ltally";
export const USER_DETAILS_LOCAL = "utally";

export const ENDPOINTS = {
    idleChecker: `/api/healthchecker`,
    user: {
        loginUserByGoogle: (email: string, rmeKey?: string) => `/api/user/login?email=${email}&rmeKey=${rmeKey}`,
        getUserInfo: `/api/user/info`,
        getUsers: (page?: number, size?: number, keyword?: string, departmentId?: number, active?: boolean) =>
            `/api/users?page=${page}&size=${size}&fullName=${keyword}&departmentId=${departmentId}&active=${active}`,
        createUser: `/api/user/register`,
        updateUser: `/api/user/update`,
        updateUserProfile: `/api/user/profile/update`,
        googleSyncProfile: `/api/user/sync/google`,
        archiveUser: `/api/user/archive`,
        unArchiveUser: `/api/user/unarchive`,
        hideUser: `/api/user/hide`,
        logout: `/api/user/logout`
    },
    department: {
        getDepartments: (page?: number, size?: number, keyword?: string, active?: boolean) =>
            `/api/departments?page=${page}&size=${size}&departmentName=${keyword}&active=${active}`,
        createDepartment: `/api/department/create`,
        updateDepartment: `/api/department/update`,
        archiveDepartment: `/api/department/archive`,
        unArchiveDepartment: `/api/department/unarchive`,
        hideDepartment: `/api/department/hide`
    },
    otp: {
        generateOtp: `/api/otp/generate`,
        verifyOtp: (otpToken: string, rememberMe?: boolean) => `/api/otp/verify?otpToken=${otpToken}&rememberMe=${rememberMe}`,
        removeOtp: `/api/otp/remove`
    },
    announcementPost: {
        getPosts: (page: number, size: number, startDate?: Date, endDate?: Date) =>
            `/api/announcements?page=${page}&size=${size}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`,
        createPost: `/api/announcement/create`,
        updatePost: `/api/announcement/update`,
        archivePost: `/api/announcement/archive`
    },
    discrepancyReport: {
        getReports: (page: number, size: number, startDate?: Date, endDate?: Date) =>
            `/api/discrepancy-reports?page=${page}&size=${size}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`,
        createReport: `/api/discrepancy-report/create`,
        updateReport: `/api/discrepancy-report/update`,
        archiveReport: `/api/discrepancy-report/archive`
    },
    inventory: {
        getCategories: `/api/inventory/categories`,
        getAssets: (categoryId: number, assetStatusId?: number, page?: number, size?: number,
            keyword?: string, orderBy?: string, active?: boolean) =>
            `/api/inventory/assets?categoryId=${categoryId}&assetStatusId=${assetStatusId}&page=${page}&size=${size}&assetCode=${keyword}&orderBy=${orderBy}&active=${active}`,
        getAssetBySharedId: (sharedId?: string) =>
            `/api/inventory/asset?sharedId=${sharedId}`,
        createAsset: `/api/inventory/asset/create`,
        updateAsset: `/api/inventory/asset/update`,
        transactAsset: `/api/inventory/asset/transact`,
        archiveAsset: `/api/inventory/asset/archive`,
        unArchiveAsset: `/api/inventory/asset/unarchive`,
        destroyAsset: `/api/inventory/asset/destroy`
    },
    warehouse: {
        getItemCategories: `/api/warehouse/categories`,
        getItems: (categoryId: number, keyword?: string, sortBy?: string, active?: boolean) =>
            `/api/warehouse/items?categoryId=${categoryId}&itemCode=${keyword}&sortBy=${sortBy}&active=${active}`,
        getLogs: (keyword?: string, sortBy?: string, active?: boolean) =>
            `/api/warehouse/logs?itemCode=${keyword}&sortBy=${sortBy}&active=${active}`,
        createItem: `/api/warehouse/item/create`,
        updateItem: `/api/warehouse/item/update`,
        archiveItem: `/api/warehouse/item/archive`,
        unArchiveItem: `/api/warehouse/item/unarchive`,
        hideItem: `/api/warehouse/item/hide`,
        transactItem: `/api/warehouse/transact/create`,
        archiveTransact: `/api/warehouse/transact/archive`,
        unArchiveTransact: `/api/warehouse/transact/unarchive`,
        hideTransact: `/api/warehouse/transact/hide`,
    },
    request: {
        getAssetRequests: (keyword?: string, orderBy?: string) =>
            `/api/requests?fullName=${keyword}&orderBy=${orderBy}`,
        createAssetRequest: `/api/request/create`,
        respondAssetRequest: `/api/request/answer`,
        closeAssetRequest: `/api/request/close`,
        hideRequest: `/api/request/hide`
    },
    log: {
        getLogs: (startDate?: Date, endDate?: Date, categoryId?: number, assetStatusId?: number, orderByRef?: string, orderBy?: string, page?:
            number, size?: number, keyword?: string) =>
            `/api/inventory/asset/logs?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&categoryId=${categoryId}
            &assetStatusId=${assetStatusId}&orderByRef=${orderByRef}&orderBy=${orderBy}&page=${page}&size=${size}&assetCode=${keyword}`,
        destroyLogs: `/api/inventory/asset/logs/destroy`
    },
    faq: {
        getFaq: `/api/faq`,
        updateFaq: `/api/faq/update`,
    },
    notification: {
        getUserNotifications: `/api/notification/all`,
        markViewNotifications: `/api/notification/viewed`,
        hideNotification: `/api/notification/hide`,
    }
}

export const fallbackPic =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==";