import { Routes } from '@angular/router';
import { TenantList } from './tenant-list/tenant-list';
import { TenantDetail } from './tenant-detail/tenant-detail';

export const routes: Routes = [
    {
        path: '',
        component: TenantList
    },
    {
        path: ':id',
        component: TenantDetail
    }
];
