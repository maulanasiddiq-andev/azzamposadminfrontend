import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'identity',
        pathMatch: 'full'
    },
    {
        path: 'identity',
        loadChildren: () => import('./identity/identity.routes').then(m => m.routes)
    },
    {
        path: 'akuntansi',
        loadChildren: () => import('./akuntansi/akuntansi.routes').then(m => m.routes)
    }
];
