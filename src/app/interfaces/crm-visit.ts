import { CrmLead } from './crm-lead';

export interface CrmVisit {
  createDate?: Date;
  crmLead?: CrmLead;
  crmLeadId?: number;
  id?: number;
  device?: any;
  deviceId?: number;
  entryUrl?: string;
  guid?: string;
  ip?: any;
  ipId?: number;
  referrerUrl?: string;
}
