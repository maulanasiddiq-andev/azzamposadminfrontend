import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/wrappers/base-response';
import { SearchResponse } from '../../models/wrappers/search-response';
import { Tenant } from '../../models/masterdata/tenant';

@Service()
export class TenantService {
    #http = inject(HttpClient);
    apiUrl: string = environment.apiUrl + "tenant/";

    getTenants(params: any): Observable<BaseResponse<SearchResponse<Tenant>>> {
        return this.#http.get<BaseResponse<SearchResponse<Tenant>>>(this.apiUrl + "search", { params: params });
    }
}
