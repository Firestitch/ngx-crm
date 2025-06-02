import { AfterViewInit, ChangeDetectionStrategy, Component, Input, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { CrmLead, LeadSecondaryContainer } from '../../../interfaces';


@Component({
  selector: 'app-secondary-container',
  templateUrl: './secondary-container.component.html',
  styleUrls: ['./secondary-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SecondaryContainerComponent implements AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;

  @Input() public componentClass: Type<LeadSecondaryContainer>;
  @Input() public crmLead: CrmLead;
  @Input() public notesTemplate: TemplateRef<any>;
  @Input() public taskTemplate: TemplateRef<any>;
  
  public ngAfterViewInit(): void {
    this.container.clear();
    const componentRef = this.container.createComponent(this.componentClass);

    componentRef.instance.crmLead = this.crmLead;
    componentRef.instance.notesTemplate = this.notesTemplate;
    componentRef.instance.taskTemplate = this.taskTemplate;
  }
}
