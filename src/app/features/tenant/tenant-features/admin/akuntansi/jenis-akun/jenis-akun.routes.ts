import { Routes } from "@angular/router";
import { JenisAkunList } from "./jenis-akun-list/jenis-akun-list";
import { JenisAkunDetail } from "./jenis-akun-detail/jenis-akun-detail";

export const routes: Routes = [
  {
    path: '',
    component: JenisAkunList
  },
  {
    path: ':jenisAkunId',
    component: JenisAkunDetail
  }
]