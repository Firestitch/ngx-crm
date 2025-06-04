import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class LeadFileData<T = any> {

  constructor(private _api: FsApi) {}

  public get(crmLeadId, id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${crmLeadId}/files/${id}`,
      query,
      {
        key: 'crmFile',
        ...config,
      },
    );
  }

  public gets(crmLeadId, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      `crm/leads/${crmLeadId}/files`,
      query,
      {
        key: 'crmFiles',
        ...config,
      },
    );
  }

  public put(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/${crmLeadId}/files/${data.id}`,
      data,
      {
        key: 'crmFile',
        ...config,
      },
    );
  }

  public post(crmLeadId, file: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      `crm/leads/${crmLeadId}/files`,
      { file },
      {
        key: 'crmFile',
        ...config,
      },
    );
  }

  public delete(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `crm/leads/${crmLeadId}/files/${data.id}`,
      data,
      {
        key: 'crmFile',
        ...config,
      },
    );
  }

  public save(crmLeadId, data: any): Observable<T> {
    return (data.id)
      ? this.put(crmLeadId, data)
      : this.post(crmLeadId, data);
  }

}
