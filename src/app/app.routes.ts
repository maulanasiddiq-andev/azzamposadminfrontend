import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { LoadingLayout } from './layouts/loading-layout/loading-layout';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'tenant',
        component: LoadingLayout,
        loadChildren: () => import('./features/tenant/tenant.routes').then(m => m.routes)
    }
];
