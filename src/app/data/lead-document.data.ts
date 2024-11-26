import { Injectable } from '@angular/core';

import { FsApi, FsApiFile, RequestConfig, RequestMethod } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LeadDocumentData<T = any> {

  constructor(private _api: FsApi) {}

  public get(crmLeadId, id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${crmLeadId}/documents/${id}`,
      query,
      {
        key: 'document',
        ...config,
      },
    );
  }

  public gets(crmLeadId, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      `crm/leads/${crmLeadId}/documents`,
      query,
      {
        key: 'documents',
        ...config,
      },
    );
  }

  public put(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/${crmLeadId}/documents/${data.id}`,
      data,
      {
        key: 'document',
        ...config,
      },
    );
  }

  public post(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      `crm/leads/${crmLeadId}/documents`,
      data,
      {
        key: 'document',
        ...config,
      },
    );
  }

  public delete(crmLeadId, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `crm/leads/${crmLeadId}/documents/${data.id}`,
      data,
      {
        key: 'document',
        ...config,
      },
    );
  }
  
  public getFields(crmLeadId, id: any, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/leads/${crmLeadId}/documents/${id}/fields`,
      {},
      {
        key: 'fields',
        ...config,
      },
    );
  }

  public putFields(crmLeadId, id: any, fields: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/leads/${crmLeadId}/documents/${id}/fields`,
      { fields },
      {
        key: 'fields',
        ...config,
      },
    );
  }

  public actionFields(crmLeadId, documentId: any, data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      `crm/leads/${crmLeadId}/documents/${documentId}/fields/action`,
      data,
      {
        key: null,
        ...config,
      },
    );
  }

  public fieldFileAction(crmLeadId, documentId: any, data: any): FsApiFile {
    return this._api.createApiFile(
      `crm/leads/${crmLeadId}/documents/${documentId}/fields/action`,
      {
        data,
        method: RequestMethod.Post,
      },      
    );
  }

  public save(crmLeadId, data: any): Observable<T> {
    return (data.id)
      ? this.put(crmLeadId, data)
      : this.post(crmLeadId, data);
  }

}
