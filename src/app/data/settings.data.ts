import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SettingData<T = any> {

  constructor(private _api: FsApi) {}

  public leadsFields(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      'crm/settings/leads/fields',
      query,
      {
        key: null,
        ...config,
      },
    );
  }

  public postLeadsFields(value: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'crm/settings/leads/fields',
      { value },
      {
        key: '',
        ...config,
      },
    );
  }

  public leadsSummaryProfileFields(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      'crm/settings/leads/summary/profile/fields',
      query,
      {
        key: null,
        ...config,
      },
    );
  }

  public postLeadsSummaryProfileFields(value: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'crm/settings/leads/summary/profile/fields',
      { value },
      {
        key: '',
        ...config,
      },
    );
  }

}
