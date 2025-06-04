import { Injectable, inject } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class LeadLogData<T = any> {
  private _api = inject(FsApi);


  public get(crmLeadId, id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${crmLeadId}/logs/${id}`,
      query,
      {
        key: 'crmLog',
        ...config,
      },
    );
  }

  public gets(crmLeadId, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      `crm/leads/${crmLeadId}/logs`,
      query,
      {
        key: 'crmLogs',
        ...config,
      },
    );
  }

  public put(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/${crmLeadId}/logs/${data.id}`,
      data,
      {
        key: 'crmLog',
        ...config,
      },
    );
  }

  public post(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      `crm/leads/${crmLeadId}/logs`,
      data,
      {
        key: 'crmLog',
        ...config,
      },
    );
  }

  public delete(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `crm/leads/${crmLeadId}/logs/${data.id}`,
      data,
      {
        key: 'crmLog',
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
