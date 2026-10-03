import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/wrappers/base-response';
import { SearchResponse } from '../../models/wrappers/search-response';
import { MappingAkun } from '../../models/akuntansi/mapping-akun';

@Service()
export class MappingAkunService {
  #http = inject(HttpClient);
  apiUrl: string = environment.apiUrl + "akuntansi/MappingAkun/";

  getMappingAkuns(params: any, tenantId: string): Observable<BaseResponse<SearchResponse<MappingAkun>>> {
    return this.#http.get<BaseResponse<SearchResponse<MappingAkun>>>(this.apiUrl + tenantId + "/search", { params: params });
  }

  getMappingAkunById(mappingAkunId: string, tenantId: string): Observable<BaseResponse<MappingAkun>> {
    return this.#http.get<BaseResponse<MappingAkun>>(this.apiUrl + tenantId + "/getbyid/" + mappingAkunId);
  }
}
