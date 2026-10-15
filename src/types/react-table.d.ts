import type { UseSortByColumnProps } from "react-table";

// Official react-table v7 TypeScript pattern: the published @types/react-table
// declares the plugin prop interfaces but does not mix them into the instance
// types, so consumers augment the module for the plugins they use (useSortBy).
declare module "react-table" {
    export interface ColumnInstance<D extends object = {}>
        extends UseSortByColumnProps<D> {}
}
