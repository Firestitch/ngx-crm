import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CrmLead, LeadTab } from '../../../../../../src/app';


@Component({
  templateUrl: './lead-tab.component.html',
  styleUrls: ['./lead-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    JsonPipe,
  ],
})
export class LeadTabComponent implements LeadTab {
  
  @Input() public crmLead: CrmLead;

}
