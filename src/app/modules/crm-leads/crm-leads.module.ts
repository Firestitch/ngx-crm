import { ModuleWithProviders, NgModule } from '@angular/core';

import { FS_CRM_LEADS_ROOT_CONFIG } from '../../injectors/crm-leads-root-config.injector';
import { CrmLeadsConfig } from '../../interfaces';


@NgModule()
export class FsCrmLeadsModule { 
  public static forRoot(config: CrmLeadsConfig = {}): ModuleWithProviders<FsCrmLeadsModule> {
    return {
      ngModule: FsCrmLeadsModule,
      providers: [
        {
          provide: FS_CRM_LEADS_ROOT_CONFIG,
          useValue: config,
        },
      ], 
    };
  }
}
