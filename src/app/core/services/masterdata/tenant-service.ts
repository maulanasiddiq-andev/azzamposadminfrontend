import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/wrappers/base-response';
import { SearchResponse } from '../../models/wrappers/search-response';

@Service()
export class TenantService {
    #http = inject(HttpClient);
    apiUrl: string = environment.apiUrl + "tenant/";

    getTenants(params: any): Observable<BaseResponse<SearchResponse<any>>> {
        return this.#http.get<BaseResponse<SearchResponse<any>>>(this.apiUrl + "search", { params: params });
    }
}
