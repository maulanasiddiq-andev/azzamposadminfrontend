import { Routes } from '@angular/router';
import { AkunList } from './akun-list/akun-list';
import { AkunDetail } from './akun-detail/akun-detail';

export const routes: Routes = [
  {
    path: '',
    component: AkunList
  },
  {
    path: ':akunId',
    component: AkunDetail
  },
];