import { Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DocumentRequestData {

  constructor(
    private _api: FsApi,
  ) { }

  public get(guid: string, data = {}, options: any = {}): Observable<any> {
    return this._api
      .post(`documentrequest/${guid}`, data, { key: 'documentRequest', ...options });
  }

  public getDocumentRequestItem(guid, documentRequestItemId, data): Observable<any> {
    return this._api
      .get(`documentrequest/${guid}/items/${documentRequestItemId}`, data, { 
        key: 'documentRequestItem', 
      });
  }

  public postDocumentRequestItem(guid, documentRequestItemId, data): Observable<any> {
    return this._api
      .post(`documentrequest/${guid}/items/${documentRequestItemId}`, data, { 
        key: 'documentRequestItem',
      });
  }

  public getFields(guid, documentRequestItemId): Observable<any> {
    return this._api
      .get(`documentrequest/${guid}/items/${documentRequestItemId}/fields`, null, { 
        key: 'fields', 
      });
  }

  public fieldAction(guid, documentRequestItemId, data): Observable<any> {
    return this._api
      .get(`documentrequest/${guid}/items/${documentRequestItemId}/fields/action`, data, { 
        key: null,
      });
  }

}

