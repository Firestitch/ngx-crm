import { inject, Injectable } from '@angular/core';

import { FS_CRM_CONFIG, FS_CRM_LEADS_CONFIG, FS_CRM_LEADS_ROOT_CONFIG } from '../injectors';
import { CrmLeadConfig, CrmLeadsConfig } from '../interfaces';

@Injectable()
export class CrmLeadsService {

  private _config: CrmLeadsConfig;
  private _componentConfig: CrmLeadsConfig;

  private _moduleConfig = inject(FS_CRM_CONFIG, { optional: true });
  private _moduleLeadsConfig = inject(FS_CRM_LEADS_CONFIG, { optional: true });
  private _rootLeadsConfig = inject(FS_CRM_LEADS_ROOT_CONFIG, { optional: true });
  
  public init(
    componentConfig: CrmLeadsConfig,
  ): void {
    this._componentConfig = componentConfig;

    this._config = {
      ...this._moduleConfig?.crmLeadsConfig || {},
      ...this._rootLeadsConfig || {},
      ...this._moduleLeadsConfig || {},
      ...componentConfig,
    };
  }

  public get config(): CrmLeadsConfig {
    return this._config;
  }

  public fetchQuery(query: any): { [key: string]: any } {
    query = {
      ...(this._rootLeadsConfig?.fetch?.query?.(query) || {}),
      ...(this._moduleConfig?.crmLeadsConfig?.fetch?.query?.(query) || {}),
      ...(this._moduleLeadsConfig?.fetch?.query?.(query) || {}),
      ...(this._componentConfig?.fetch?.query?.(query) || {}),
    };

    return query;
  }

  public get crmLeadConfig(): CrmLeadConfig {
    return this._config.crmLeadConfig || {};
  }
}
