import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AccountData<T = any> {

  constructor(private _api: FsApi) {}

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      'crm/accounts',
      query,
      {
        key: 'accounts',
        ...config,
      },
    );
  }

}