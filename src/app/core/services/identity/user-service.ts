import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/wrappers/base-response';
import { SearchResponse } from '../../models/wrappers/search-response';
import { User } from '../../models/identity/user';

@Service()
export class UserService {
  #http = inject(HttpClient);
  apiUrl: string = environment.apiUrl + "user/";

  getUsers(params: any, tenantId: string): Observable<BaseResponse<SearchResponse<User>>> {
      return this.#http.get<BaseResponse<SearchResponse<User>>>(this.apiUrl + tenantId + "/search", { params: params });
  }

  getUserById(userId: string, tenantId: string): Observable<BaseResponse<User>> {
      return this.#http.get<BaseResponse<User>>(this.apiUrl + tenantId + "/getbyid/" + userId);
  }
}
