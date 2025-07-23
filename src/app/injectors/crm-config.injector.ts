import { InjectionToken } from '@angular/core';

import { CrmConfig } from '../interfaces/crm-config';


export const FS_CRM_CONFIG = new InjectionToken<CrmConfig>('fs-crm-config');
