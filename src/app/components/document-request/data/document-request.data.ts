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
    return this._api.post(`documentrequest/${guid}`, data, { key: 'documentRequest', ...options });
  }

  public getDocumentRequestItem(guid, documentRequestItemId, options: any = {}): Observable<any> {
    return this._api.get(`documentrequest/${guid}/items/${documentRequestItemId}`, null, { key: 'documentRequestItem', ...options });
  }

  public postDocumentRequestItem(guid, documentRequestItemId, data, options: any = {}): Observable<any> {
    return this._api.post(`documentrequest/${guid}/items/${documentRequestItemId}`, data, { key: 'documentRequestItem', ...options });
  }

  public getFields(guid, documentRequestItemId, options: any = {}): Observable<any> {
    return this._api.get(`documentrequest/${guid}/items/${documentRequestItemId}/fields`, null, { key: 'fields', ...options });
  }

}

