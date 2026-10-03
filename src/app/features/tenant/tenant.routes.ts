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
    },
    {
        path: ':id/admin',
        loadChildren: () => import('./tenant-features/admin/admin.routes').then(m => m.routes)
    },
];
