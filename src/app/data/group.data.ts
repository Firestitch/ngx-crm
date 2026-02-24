import { Injectable, inject } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { CrmGroup } from '../interfaces/crm-group';

@Injectable()
export class GroupData<T = any> {
  private _api = inject(FsApi);

  public gets(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      'crm/groups',
      query,
      {
        key: 'crmGroups',
        ...config,
      },
    );
  }

  public get(id: number, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `crm/groups/${id}`,
      {},
      {
        key: 'crmGroup',
        ...config,
      },
    );
  }

  public post(data: Partial<CrmGroup>, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      'crm/groups',
      data,
      {
        key: 'crmGroup',
        ...config,
      },
    );
  }

  public put(data: CrmGroup, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `crm/groups/${data.id}`,
      data,
      {
        key: 'crmGroup',
        ...config,
      },
    );
  }

  public delete(data: CrmGroup, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `crm/groups/${data.id}`,
      data,
      {
        key: 'crmGroup',
        ...config,
      },
    );
  }

  public save(data: Partial<CrmGroup>): Observable<T> {
    return data.id ? this.put(data as CrmGroup) : this.post(data);
  }
}
