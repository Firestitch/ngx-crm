import { Type } from '@angular/core';

import { LeadSecondaryContainer } from './lead-secondary-container';
import { LeadTab } from './lead-tab';


export interface CrmLeadConfig {
  task?: {
    enabled: boolean;
  };
  visit?: {
    enabled: boolean;
  };
  doc?: {
    enabled?: boolean;
  };
  file?: {
    enabled?: boolean;
  };
  tabs?: {
    label: string;
    component: Type<LeadTab>;
  }[];
  secondaryContainer?: {
    component: Type<LeadSecondaryContainer>;
  }
}

