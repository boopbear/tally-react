import { IOption } from "../../../interfaces/overview";

export const suppliedSortByOptions: IOption[] = [
    {
        key: "0",
        label: "Item Code",
        value: "itemCode"
    },
    {
        key: "1",
        label: "Description",
        value: "description"
    },
    {
        key: "2",
        label: "OUM",
        value: "oum"
    },
    {
        key: "3",
        label: "Total Qty",
        value: "totalQty"
    },
    {
        key: "4",
        label: "Remaining Qty",
        value: "remQty"
    },
    {
        key: "5",
        label: "Location",
        value: "location"
    },
    {
        key: "6",
        label: "Pending Order",
        value: "pendingOrder"
    },
    {
        key: "7",
        label: "PO Number",
        value: "poNumber"
    },
];

export const warehouseItemIsArchivedOptions: IOption[] = [
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