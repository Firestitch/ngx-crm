import { Injectable } from '@angular/core';

import { CrmLeadConfig } from '../interfaces';

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

  private _config: CrmLeadConfig;

  public init(config: CrmLeadConfig): void {
    this._config = config || {};

    this.task.enabled = this._config.task?.enabled ?? true;
    this.file.enabled = this._config.file?.enabled ?? true;
    this.doc.enabled = this._config.doc?.enabled ?? true;
    this.visit.enabled = this._config.visit?.enabled ?? true;
  }

  public getConfig(): CrmLeadConfig {
    return this._config;
  }
}
