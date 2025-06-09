import { Injectable } from '@angular/core';

import { CrmLeadConfig, CrmLeadsConfig } from '../interfaces';

@Injectable()
export class CrmLeadsService {

  private _config: CrmLeadsConfig;
  private _rootConfig: CrmLeadsConfig;
  private _moduleConfig: CrmLeadsConfig;
  private _componentConfig: CrmLeadsConfig;

  public init(
    rootConfig: CrmLeadsConfig, 
    moduleConfig: CrmLeadsConfig, 
    componentConfig: CrmLeadsConfig,
  ): void {
    this._rootConfig = rootConfig;
    this._moduleConfig = moduleConfig;
    this._componentConfig = componentConfig;

    this._config = {
      ...rootConfig,
      ...moduleConfig,
      ...componentConfig,
    };
  }

  public get config(): CrmLeadsConfig {
    return this._config;
  }

  public fetchQuery(query: any): { [key: string]: any } {
    query = this._rootConfig.fetch?.query?.(query) || query;
    query = this._moduleConfig.fetch?.query?.(query) || query;
    query = this._componentConfig.fetch?.query?.(query) || query;

    return query;
  }

  public get crmLeadConfig(): CrmLeadConfig {
    return this._config.crmLeadConfig || {};
  }
}
