import { AfterViewInit, ChangeDetectionStrategy, Component, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { CrmLead } from '../../../interfaces';


@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ColumnComponent implements AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;

  @Input() public componentClass: Type<any>;
  @Input() public crmLead: CrmLead;
  
  public ngAfterViewInit(): void {
    this.container.clear();
    const componentRef = this.container.createComponent(this.componentClass);

    componentRef.instance.crmLead = this.crmLead;
  }
}
