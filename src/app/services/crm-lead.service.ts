import { Injectable, Type } from '@angular/core';

import { Observable, of } from 'rxjs';

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

  public init(config: CrmLeadConfig): void {
    this._config = config || {};

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
}
