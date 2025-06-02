import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CrmLead, LeadsColumn } from '../../../../../../src/app';


@Component({
  templateUrl: './lead-column.component.html',
  styleUrls: ['./lead-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    JsonPipe,
  ],
})
export class LeadColumnComponent implements LeadsColumn {
  
  @Input() public crmLead: CrmLead;

}
