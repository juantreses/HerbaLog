import * as userStorage from "./user/userStorage.ts";
import * as productCategoryStorage from "./product/categoryStorage.ts";
import * as adminActivityStorage from "./admin/activityStorage.ts";
import {sessionStore} from "./sessionStore.ts";

export interface IStorage {
    users: typeof userStorage,
    products: {
        categories: typeof productCategoryStorage
    };
    adminActivities: typeof adminActivityStorage;
    sessionStore: typeof sessionStore;
}

export const storage: IStorage = {
    users: userStorage,
    products: {
        categories: productCategoryStorage
    },
    adminActivities: adminActivityStorage,
    sessionStore: sessionStore,
}