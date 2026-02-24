
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

import { GroupData } from '../../data';


@Component({
  selector: 'app-lead-groups',
  templateUrl: './lead-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm },
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LeadGroupsComponent,
      multi: true,
    },
    GroupData,
  ],
  imports: [
    FormsModule,
    FsAutocompleteChipsModule,
  ],
})
export class LeadGroupsComponent implements ControlValueAccessor {

  @Input() public padless = false;
  @Input() public initOnClick = false;

  public crmGroups = [];
  public onChange: (value) => void;

  private _groupData = inject(GroupData);

  public fetchGroups = (keyword) => {
    return this._groupData
      .gets({ keyword }, { key: 'crmGroups' });
  };

  public change(crmGroups): void {
    this.onChange(crmGroups);
  }

  public writeValue(crmGroups): void {
    this.crmGroups = crmGroups ?? [];
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
