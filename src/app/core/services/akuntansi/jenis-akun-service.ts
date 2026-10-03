import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/wrappers/base-response';
import { SearchResponse } from '../../models/wrappers/search-response';
import { JenisAkun } from '../../models/akuntansi/jenis-akun';

@Service()
export class JenisAkunService {
  #http = inject(HttpClient);
  apiUrl: string = environment.apiUrl + "akuntansi/jenisakun/";

  getJenisAkuns(params: any, tenantId: string): Observable<BaseResponse<SearchResponse<JenisAkun>>> {
    return this.#http.get<BaseResponse<SearchResponse<JenisAkun>>>(this.apiUrl + "search", { params: params });
  }

  getJenisAkunById(jenisAkunId: string, tenantId: string): Observable<BaseResponse<JenisAkun>> {
    return this.#http.get<BaseResponse<JenisAkun>>(this.apiUrl + "getbyid/" + jenisAkunId);
  }
}
