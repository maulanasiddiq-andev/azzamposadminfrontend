import { Routes } from "@angular/router";
import { MappingAkunList } from "./mapping-akun-list/mapping-akun-list";
import { MappingAkunDetail } from "./mapping-akun-detail/mapping-akun-detail";

export const routes: Routes = [
  {
    path: '',
    component: MappingAkunList
  },
  {
    path: ':mappingAkunId',
    component: MappingAkunDetail
  },
];