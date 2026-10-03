import { Routes } from "@angular/router";
import { UserList } from "./user-list/user-list";
import { UserDetail } from "./user-detail/user-detail";

export const routes: Routes = [
    {
        path: '',
        component: UserList
    },
    {
        path: ':userId',
        component: UserDetail
    }
];