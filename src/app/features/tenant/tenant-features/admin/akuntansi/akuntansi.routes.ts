import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'mapping-akun',
    pathMatch: 'full'
  },
  {
    path: 'mapping-akun',
    loadChildren: () => import('./mapping-akun/mapping-akun.routes').then(m => m.routes)
  },
  {
    path: 'akun',
    loadChildren: () => import('./akun/akun.routes').then(m => m.routes)
  }
];