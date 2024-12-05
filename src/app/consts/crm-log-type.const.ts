import { CrmLogType } from '../enums/crm-log-type.enum';

export const CrmLogTypes = [
  { name: 'Outgoing call', value: CrmLogType.OutgoingCall },
  { name: 'Incoming call', value: CrmLogType.IncomingCall },
  { name: 'Outgoing email', value: CrmLogType.OutgoingEmail },
  { name: 'Incoming email', value: CrmLogType.IncomingEmail },
  { name: 'Meeting', value: CrmLogType.Meeting },
  { name: 'Other', value: CrmLogType.Other },
];
