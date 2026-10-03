import { Routes } from '@angular/router';
import { RoleList } from './role-list/role-list';
import { RoleDetail } from './role-detail/role-detail';

export const routes: Routes = [
    {
        path: '',
        component: RoleList
    },
    {
        path: ':roleId',
        component: RoleDetail
    }
];
