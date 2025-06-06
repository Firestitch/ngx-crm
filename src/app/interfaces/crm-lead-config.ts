import { Type } from '@angular/core';

import { AddActivityMenuItem } from './add-actvity-menu-item';
import { LeadActivityTypePreview } from './lead-activity-type-preview';
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
  };
  fetch?: {
    query?: any;
  };
  activity?: {
    enabled?: boolean;
    getAddMenuItems?: (addActivityMenuItems: AddActivityMenuItem[]) => AddActivityMenuItem[];
    typePreviews?: {
      activityType: string;
      component: Type<LeadActivityTypePreview>;
    }[];
  };
}

