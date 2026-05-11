import { Type } from '@angular/core';


import { IFilterConfigItem } from '@firestitch/filter';
import { FsListAction, FsListActionSelected } from '@firestitch/list';
import { FsSelectionDialogConfigAction } from '@firestitch/selection';

import { Observable } from 'rxjs';

import { CrmGroup } from './crm-group';
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
    title?: string;
    align?: 'left' | 'right' | 'center';
    component: Type<LeadsColumn>;
  }[];
  filters?: IFilterConfigItem[];
  actions?: FsListAction[];
  settings?: {
    groups?: {
      enabled?: boolean;
    };
  };
  groupChipLabel?: (group: CrmGroup) => string;
  selectionActions?: {
    actions: FsSelectionDialogConfigAction[];
    actionSelected: (event: FsListActionSelected) => Observable<any>;
  };
}
