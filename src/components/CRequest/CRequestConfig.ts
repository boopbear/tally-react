import { EnOrderBy } from "../../constants";
import { IOption } from "../../interfaces/overview";

export const requestOrderByOptions: IOption[] = [
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