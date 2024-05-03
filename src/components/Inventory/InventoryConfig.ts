import { EnInventoryAssetStatus, EnInventoryCategories, EnQRStatus, EnOrderBy } from "../../constants";
import { IDropdownItem } from "../../interfaces/inventory";
import { IOption } from "../../interfaces/overview";

type TAssetStatus = {
    [key in EnInventoryCategories]: IDropdownItem[];
};

export const inventoryCategoryOptions: IDropdownItem[] = [
    {
        key: "0",
        label: EnInventoryCategories.CURRENT,
        value: EnInventoryCategories.CURRENT
    },
    {
        key: "1",
        label: EnInventoryCategories.OUTGOING,
        value: EnInventoryCategories.OUTGOING
    },
];

export const assetStatusOptions: TAssetStatus = {
    [EnInventoryCategories.CURRENT]: [
        {
            key: "0",
            label: EnInventoryAssetStatus.TRANSFER,
            value: EnInventoryAssetStatus.TRANSFER
        },
        {
            key: "1",
            label: EnInventoryAssetStatus.REPAIR,
            value: EnInventoryAssetStatus.REPAIR,
        },
        {
            key: "2",
            label: EnInventoryAssetStatus.TRADEIN,
            value: EnInventoryAssetStatus.TRADEIN,
        },
        {
            key: "3",
            label: EnInventoryAssetStatus.PULLOUT,
            value: EnInventoryAssetStatus.PULLOUT,
        },
        {
            key: "4",
            label: EnInventoryAssetStatus.TURNOVER,
            value: EnInventoryAssetStatus.TURNOVER,
        },
        {
            key: "5",
            label: EnInventoryAssetStatus.RETURNTOSUPPLIER,
            value: EnInventoryAssetStatus.RETURNTOSUPPLIER,
        },
    ],
    [EnInventoryCategories.OUTGOING]: [
        {
            key: "0",
            label: EnInventoryAssetStatus.SALE,
            value: EnInventoryAssetStatus.SALE,
        },
        {
            key: "1",
            label: EnInventoryAssetStatus.DONATE,
            value: EnInventoryAssetStatus.DONATE,
        },
        {
            key: "2",
            label: EnInventoryAssetStatus.SCRAP,
            value: EnInventoryAssetStatus.SCRAP,
        },
        {
            key: "3",
            label: EnInventoryAssetStatus.DISPOSAL,
            value: EnInventoryAssetStatus.DISPOSAL,
        },
        {
            key: "4",
            label: EnInventoryAssetStatus.SAFEKEEPING,
            value: EnInventoryAssetStatus.SAFEKEEPING,
        },
    ],
};

export const orderByOptions: IOption[] = [
    {
        key: "0",
        label: EnOrderBy.ASC,
        value: "asc"
    },
    {
        key: "1",
        label: EnOrderBy.DESC,
        value: "desc"
    },
];

export const qrStatusOptions: IOption[] = [
    {
        key: "0",
        label: EnQRStatus.NOTGENERATED,
        value: "0"
    },
    {
        key: "1",
        label: EnQRStatus.GENERATED,
        value: "1"
    },
];

export const assetIsArchivedOptions: IOption[] = [
    {
        key: "0",
        label: "Active",
        value: "true"
    },
    {
        key: "1",
        label: "Archived",
        value: "false"
    },
];