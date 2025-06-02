import { ModuleWithProviders, NgModule } from '@angular/core';

import { FS_CRM_LEAD_ROOT_CONFIG } from '../../injectors';
import { CrmLeadConfig } from '../../interfaces';


@NgModule()
export class FsCrmLeadModule { 
  public static forRoot(config: CrmLeadConfig = {}): ModuleWithProviders<FsCrmLeadModule> {
    return {
      ngModule: FsCrmLeadModule,
      providers: [
        {
          provide: FS_CRM_LEAD_ROOT_CONFIG,
          useValue: config,
        },
      ], 
    };
  }
}
