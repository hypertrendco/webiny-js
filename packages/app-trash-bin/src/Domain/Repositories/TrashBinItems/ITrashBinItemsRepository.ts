import { Meta } from "@webiny/app-utils";
import { TrashBinItem } from "~/Domain";
import { TrashBinListQueryVariables } from "~/types";

export interface ITrashBinItemsRepository {
    listItems: (params?: TrashBinListQueryVariables) => Promise<void>;
    listMoreItems: () => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    restoreItem: (id: string) => Promise<void>;
    getItems: () => TrashBinItem[];
    getRestoredItems: () => TrashBinItem[];
    getMeta: () => Meta;
    getLoading: () => Record<string, any>;
}
