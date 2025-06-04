import { FsFile } from '@firestitch/file';

import { Observable } from 'rxjs';

import { CrmLead } from './crm-lead';


export interface AddActivityMenuItem {
  label: string;
  type?: 'file' | 'default';
  items?: AddActivityMenuItem[];
  multiple?: boolean;
  fileSelected?: (files: FsFile[] | FsFile) => void;
  click?: (crmLead: CrmLead) => Observable<any>;
}
