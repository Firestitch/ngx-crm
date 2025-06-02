
import { TemplateRef } from '@angular/core';

import { CrmLead } from './crm-lead';

export interface LeadSecondaryContainer {
  crmLead: CrmLead;
  notesTemplate: TemplateRef<any>;
  taskTemplate: TemplateRef<any>;
}


