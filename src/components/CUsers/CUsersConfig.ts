/* This TypeScript code snippet is defining a constant `requestOrderByOptions` which is an array of
objects of type `IOption`. Each object in the array has three properties: `key`, `label`, and
`value`. The `key` property is a string representing the key of the option, the `label` property is
referencing values from the `EnOrderBy` enum (presumably defining ascending and descending order),
and the `value` property is a string representing the value associated with the option (either "asc"
or "desc"). */
/* The line `import { IDropdownItem } from "../../interfaces/inventory";` is importing the
`IDropdownItem` interface from a file located at "../../interfaces/inventory". This allows the
TypeScript file to use the `IDropdownItem` interface in the current file, enabling type-checking and
providing access to the properties and methods defined in the `IDropdownItem` interface. */
import { IDropdownItem } from "../../interfaces/inventory";

export const cUsersIsArchivedOptions: IDropdownItem[] = [
    {
        key: "0",
        label: "Active",
        value: true
    },
    {
        key: "1",
        label: "Archived",
        value: false
    },
];