import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class LeadNoteData<T = any> {

  constructor(private _api: FsApi) {}

  public get(crmLeadId, id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${crmLeadId}/notes/${id}`,
      query,
      {
        key: 'crmNote',
        ...config,
      },
    );
  }

  public gets(crmLeadId, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      `crm/leads/${crmLeadId}/notes`,
      query,
      {
        key: 'crmNotes',
        ...config,
      },
    );
  }

  public put(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/${crmLeadId}/notes/${data.id}`,
      data,
      {
        key: 'crmNote',
        ...config,
      },
    );
  }

  public post(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      `crm/leads/${crmLeadId}/notes`,
      data,
      {
        key: 'crmNote',
        ...config,
      },
    );
  }

  public delete(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `crm/leads/${crmLeadId}/notes/${data.id}`,
      data,
      {
        key: 'crmNote',
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
