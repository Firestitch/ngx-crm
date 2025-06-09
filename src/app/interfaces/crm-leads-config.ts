import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { CrmLead } from './crm-lead';
import { CrmLeadConfig } from './crm-lead-config';
import { LeadsColumn } from './leads-column';

export interface CrmLeadsConfig {
  fetch?: {
    query?: (query: any) => { [key: string]: any };
  },
  create?: {
    show: boolean;
    data?: () => Observable<CrmLead>;
  },
  crmLeadConfig?: CrmLeadConfig;
  columns?: {
    title: string;
    component: Type<LeadsColumn>;
  }[];
}
