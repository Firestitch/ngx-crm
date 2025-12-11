
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  ControlContainer, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgForm,
} from '@angular/forms';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';

import { LeadData } from '../../data';


@Component({
  selector: 'app-lead-assigned-account',
  templateUrl: './lead-assigned-account.component.html',
  styleUrls: ['./lead-assigned-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm },
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LeadAssignedAccountComponent,
      multi: true,
    },
    LeadData,
  ],
  imports: [
    FormsModule,
    FsAutocompleteChipsModule
],
})
export class LeadAssignedAccountComponent implements ControlValueAccessor {

  @Input() public padless = false;
  @Input() public assignedAccount;
  
  @Input() public initOnClick = false;
  
  public onChange: (value) => void;

  private _leadData = inject(LeadData);

  public fetchAccounts = (keyword) => {
    return this._leadData
      .getAssignAccounts(keyword);
  };

    
  public change(assignedAccount): void {
    this.onChange(assignedAccount);
  }

  public writeValue(assignedAccount): void {
    this.assignedAccount = assignedAccount;
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
