import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/wrappers/base-response';
import { SearchResponse } from '../../models/wrappers/search-response';
import { Role } from '../../models/identity/role';

@Service()
export class RoleService {
  #http = inject(HttpClient);
  apiUrl: string = environment.apiUrl + "role/";

  getRoles(params: any, tenantId: string): Observable<BaseResponse<SearchResponse<Role>>> {
      return this.#http.get<BaseResponse<SearchResponse<Role>>>(this.apiUrl + tenantId + "/search", { params: params });
  }

  getRoleById(id: string): Observable<BaseResponse<Role>> {
      return this.#http.get<BaseResponse<Role>>(this.apiUrl + "getbyid/" + id);
  }
}
