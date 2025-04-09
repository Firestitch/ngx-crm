import { Account } from './account';
import { CrmChannel } from './crm-channel';

export interface CrmLead {
  name?: string;
  assignedAccount?: Account;
  assignedAccountId?: number;
  createDate?: Date;
  id?: number;
  emailCrmChannelId?: any;
  emailCrmChannels?: CrmChannel[];
  firstName?: string;
  lastName?: string;
  modifyDate?: Date;
  phoneCrmChannelId?: any;
  phoneCrmChannels?: CrmChannel[];
  urlCrmChannels?: CrmChannel[];
  primaryEmailCrmChannel?: CrmChannel;
  primaryEmailCrmChannelId?: number;
  primaryPhoneCrmChannel?: CrmChannel;
  primaryPhoneCrmChannelId?: number;
  state?: string;
  statusAttributeId?: number;
  statusAttribute?: any;
  tagAttributes?: any[];
  fields?: any;
  value?: number;
  sourceAttributeId?: number;
  sourceAttribute?: any;
  companyName?: string;
}
