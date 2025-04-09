import { Observable } from 'rxjs';

import { CrmLead } from './crm-lead';
import { CrmLeadConfig } from './crm-lead-config';

export interface CrmLeadsConfig {
  create?: {
    show: boolean;
    data?: () => Observable<CrmLead>;
  },
  crmLeadConfig?: CrmLeadConfig;
}
