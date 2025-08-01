import { Injectable, inject } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class VisitData<T = any> {
  private _api = inject(FsApi);


  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/visits/${id}`,
      query,
      {
        key: 'crmVisit',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      'crm/visits',
      query,
      {
        key: 'crmVisits',
        ...config,
      },
    );
  }

}
