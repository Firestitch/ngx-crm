import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LeadDocumentTypeData<T = any> {

  constructor(private _api: FsApi) {}

  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/documents/types/${id}`,
      query,
      {
        key: 'documentType',
        ...config,
      },
    );
  }

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      'crm/leads/documents/types',
      query,
      {
        key: 'documentTypes',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/documents/types/${data.id}`,
      data,
      {
        key: 'documentType',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'crm/leads/documents/types',
      data,
      {
        key: 'documentType',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `crm/leads/documents/types/${data.id}`,
      data,
      {
        key: 'documentType',
        ...config,
      },
    );
  }

  public getFields(documentType: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/documents/types/${documentType.id}/fields`,
      {},
      {
        key: 'fields',
        ...config,
      },
    );
  }

  
  public actionField(documentType, field, action, data): Observable<any> {
    return this._api.put(`crm/leads/documents/types/${documentType.id}/fields/action`, {
      action,
      data,
      field,
    }, { key: null });
  }

  public save(data: any): Observable<T> {
    return (data.id)
      ? this.put(data)
      : this.post(data);
  }

}
