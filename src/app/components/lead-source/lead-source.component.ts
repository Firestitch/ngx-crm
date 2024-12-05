import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlContainer, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgForm,
} from '@angular/forms';

import { AttributeColor, AttributeConfig, FsAttributeModule } from '@firestitch/attribute';


@Component({
  selector: 'app-lead-source',
  templateUrl: './lead-source.component.html',
  styleUrls: ['./lead-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LeadSourceComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    
    FsAttributeModule,
  ],
})
export class LeadSourceComponent implements ControlValueAccessor, OnInit {

  @Input() public sourceAttribute;  
  @Input() public initOnClick = false;
  
  public onChange: (value) => void;

  public attributeConfig: AttributeConfig;

  public ngOnInit(): void {
    this.attributeConfig = {
      name: 'source',
      class: 'crmLeadsource', 
      pluralName: 'sourcees',
      backgroundColor: AttributeColor.Enabled,
    };
  }
    
  public change(sourceAttribute): void {
    this.onChange(sourceAttribute);
  }

  public writeValue(sourceAttribute): void {
    this.sourceAttribute = sourceAttribute;
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
