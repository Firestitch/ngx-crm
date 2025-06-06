import { AfterViewInit, ChangeDetectionStrategy, Component, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { CrmLead } from '../../../../../../interfaces';


@Component({
  selector: 'app-activity-type-preview',
  templateUrl: './activity-type-preview.component.html',
  styleUrls: ['./activity-type-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ActivityTypePreviewComponent implements AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;

  @Input() public componentClass: Type<any>;
  @Input() public crmLead: CrmLead;
  @Input() public data: any;
  @Input() public activity: any;
  
  public ngAfterViewInit(): void {
    this.container.clear();
    const componentRef = this.container.createComponent(this.componentClass);

    componentRef.instance.crmLead = this.crmLead;
    componentRef.instance.data = this.data;
    componentRef.instance.activity = this.activity;
  }
}
