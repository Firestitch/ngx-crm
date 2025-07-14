import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { CrmLead, LeadSecondaryContainer } from '../../../interfaces';


@Component({
  selector: 'app-secondary-container',
  templateUrl: './secondary-container.component.html',
  styleUrls: ['./secondary-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SecondaryContainerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;

  @Input() public componentClass: Type<LeadSecondaryContainer>;
  @Input() public crmLead: CrmLead;
  @Input() public notesTemplate: TemplateRef<any>;
  @Input() public taskTemplate: TemplateRef<any>;

  @Output() public crmLeadChange = new EventEmitter<CrmLead>();

  private _destroy$ = new Subject<void>();
  
  public ngAfterViewInit(): void {
    this.container.clear();
    const componentRef = this.container.createComponent(this.componentClass);

    componentRef.instance.crmLead = this.crmLead;
    componentRef.instance.notesTemplate = this.notesTemplate;
    componentRef.instance.taskTemplate = this.taskTemplate;

    if (componentRef.instance.crmLeadChange) {  
      componentRef.instance.crmLeadChange
        .pipe(takeUntil(this._destroy$))
        .subscribe((crmLead) => this.crmLeadChange.emit(crmLead));
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
