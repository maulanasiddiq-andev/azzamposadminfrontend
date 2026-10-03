import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/wrappers/base-response';
import { SearchResponse } from '../../models/wrappers/search-response';
import { Akun } from '../../models/akuntansi/akun';

@Service()
export class AkunService {
  #http = inject(HttpClient);
  apiUrl: string = environment.apiUrl + "akuntansi/akun/";

  getAkuns(params: any, tenantId: string): Observable<BaseResponse<SearchResponse<Akun>>> {
    return this.#http.get<BaseResponse<SearchResponse<Akun>>>(this.apiUrl + tenantId + "/search", { params: params });
  }

  getAkunById(akunId: string, tenantId: string): Observable<BaseResponse<Akun>> {
    return this.#http.get<BaseResponse<Akun>>(this.apiUrl + tenantId + "/getbyid/" + akunId);
  }
}
