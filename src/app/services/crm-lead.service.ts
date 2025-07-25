import { inject, Injectable, Type } from '@angular/core';

import { FsApi, RequestMethod } from '@firestitch/api';
import { FsAttributeConfig } from '@firestitch/attribute';

import { map, Observable, of } from 'rxjs';

import { FS_CRM_CONFIG, FS_CRM_LEAD_CONFIG, FS_CRM_LEAD_ROOT_CONFIG } from '../injectors';
import { CrmLead, CrmLeadConfig, LeadSecondaryContainer, LeadTab } from '../interfaces';


@Injectable()
export class CrmLeadService {

  public task = {
    enabled: true,
  };

  public file = {
    enabled: true,
  };

  public doc = {
    enabled: true,
  };

  public visit = {
    enabled: true,
  };

  public tabs: {
    label: string;
    component: Type<LeadTab>;
  }[] = [];

  private _config: CrmLeadConfig;
  private _moduleConfig = inject(FS_CRM_CONFIG, { optional: true });
  private _moduleLeadconfig = inject(FS_CRM_LEAD_CONFIG, { optional: true });
  private _rootLeadConfig = inject(FS_CRM_LEAD_ROOT_CONFIG, { optional: true });
  private _api = inject(FsApi);

  public init(config: CrmLeadConfig): void {
    this._config = {
      ...this._moduleConfig?.crmLeadConfig || {},
      ...this._rootLeadConfig || {},
      ...this._moduleLeadconfig || {},
      ...config,
    };

    this.task.enabled = this._config.task?.enabled ?? true;
    this.file.enabled = this._config.file?.enabled ?? true;
    this.doc.enabled = this._config.doc?.enabled ?? true;
    this.visit.enabled = this._config.visit?.enabled ?? true;
    this.tabs = this._config.tabs || [];
  }

  public get secondaryContainer(): { component: Type<LeadSecondaryContainer> } {
    return this._config.secondaryContainer;
  }

  public get config(): CrmLeadConfig {
    return this._config;
  }

  public beforeProfileSaved(crmLead: CrmLead): Observable<CrmLead> {
    return this._config.beforeProfileSaved?.(crmLead) || of(crmLead);
  }

  public afterProfileSaved(crmLead: CrmLead): Observable<CrmLead> {
    return this._config.afterProfileSaved?.(crmLead) || of(crmLead);
  }

  public getAttributeConfig(apiPath: string): FsAttributeConfig {
    return {
      attribute: {
        save: ({ attribute }) => {
          const method = attribute.id ? RequestMethod.Put : RequestMethod.Post;
          const saveApiPath = attribute.id ? `${apiPath}/${attribute.id}` : apiPath;

          return this._api.request(method, saveApiPath, attribute, { key: null });
        },
        delete: (data) => {
          return this._api.delete(`${apiPath}/${data.id}`, data, { key: null });
        },
      },
      attributes: {
        fetch: (query) => {
          return this._api
            .get(apiPath, query, { key: null })
            .pipe(
              map((response) => {
                return { data: response.attributes, paging: response.paging };
              }),
            );
        },
      },
    };
  }
}
