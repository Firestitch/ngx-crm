import { AfterViewInit, ChangeDetectionStrategy, Component, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { CrmLead } from '../../../interfaces';


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TabComponent implements AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;

  @Input() public componentClass: Type<any>;
  @Input() public crmLead: CrmLead;
  @Input() public label: string;
  
  public ngAfterViewInit(): void {
    this.container.clear();
    const componentRef = this.container.createComponent(this.componentClass);

    componentRef.instance.crmLead = this.crmLead;
  }
}
