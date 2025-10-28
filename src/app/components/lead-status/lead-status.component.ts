
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlContainer, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgForm,
} from '@angular/forms';

import { AttributeColor, AttributeConfig, FsAttributeConfig, FsAttributeModule } from '@firestitch/attribute';

import { CrmLeadService } from '../../services';


@Component({
  selector: 'app-lead-status',
  templateUrl: './lead-status.component.html',
  styleUrls: ['./lead-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LeadStatusComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    FormsModule,
    FsAttributeModule
],
})
export class LeadStatusComponent implements ControlValueAccessor, OnInit {

  @Input() public padless = false;
  @Input() public statusAttribute;  
  @Input() public initOnClick = false;
  
  public onChange: (value) => void;

  public attributeConfig: AttributeConfig;
  public fsAttributeConfig: FsAttributeConfig;

  private _crmLeadService = inject(CrmLeadService);

  public ngOnInit(): void {
    this.fsAttributeConfig = this._crmLeadService
      .getAttributeConfig('crm/leads/statuses');
    this.attributeConfig = {
      name: 'Status',
      class: 'crmLeadStatus', 
      pluralName: 'Statuses',
      backgroundColor: AttributeColor.Enabled,
    };
  }
    
  public change(statusAttribute): void {
    this.onChange(statusAttribute);
  }

  public writeValue(statusAttribute): void {
    this.statusAttribute = statusAttribute;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(): void {
    //
  }

  public setDisabledState?(): void {
    //
  }

}
