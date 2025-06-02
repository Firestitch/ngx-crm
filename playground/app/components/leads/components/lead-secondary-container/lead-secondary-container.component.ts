import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

import { CrmLead, LeadSecondaryContainer } from '../../../../../../src/app';


@Component({
  templateUrl: './lead-secondary-container.component.html',
  styleUrls: ['./lead-secondary-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    JsonPipe,
  ],
})
export class LeadSecondaryContainerComponent implements LeadSecondaryContainer, OnInit {

  @Input() public crmLead: CrmLead;
  @Input() public notesTemplate: TemplateRef<any>;
  @Input() public taskTemplate: TemplateRef<any>;

  public ngOnInit(): void {
    console.log(this.notesTemplate);
    console.log(this.taskTemplate);
  }

}
