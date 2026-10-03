import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'role',
        pathMatch: 'full'
    },
    {
        path: 'role',
        loadChildren: () => import('./role/role.routes').then(m => m.routes)
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.routes').then(m => m.routes)
    }
];
