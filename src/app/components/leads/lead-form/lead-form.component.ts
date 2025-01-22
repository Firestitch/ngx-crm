import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';


import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsClipboard } from '@firestitch/clipboard';
import { FsDialogModule } from '@firestitch/dialog';
import { Field, FieldType } from '@firestitch/field-editor';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { of } from 'rxjs';

import { FormData } from '../../../data';


@Component({
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,

    FsFormModule,
    FsDialogModule,
    FsCheckboxGroupModule,
    FsSkeletonModule,
    FsLabelModule,
  ],
})
export class LeadFormComponent implements OnInit {

  public fields: Field[];
  public selectedFields: Field[] = [];

  public includeName: boolean = true;
  public includeEmail: boolean = true;
  public includePhone: boolean = true;

  public redirectUrl: string = '';

  private _formData = inject(FormData);
  private _clipboard = inject(FsClipboard);
  private _cdRef = inject(ChangeDetectorRef);
  private _dialogRef = inject(MatDialogRef<LeadFormComponent>);

  public ngOnInit(): void {
    this._dialogRef.updateSize('800px');
    this._formData.leadForm()
      .subscribe((leadForm) => {
        this.fields = leadForm.fields
          .filter((field) => ([
            FieldType.ShortText, 
            FieldType.LongText,
          ]
            .includes(field.type)));
        this._cdRef.markForCheck();
      });
  }

  
  public submit = () => {
    const action = new URL('/api/crm/leads/form', window.location.origin);
    const standardFields = [];
    
    if(this.includeName) {
      standardFields.push('<label for="firstName">First name</label><input type="text" name="firstName" id="firstName" value="">');
      standardFields.push('<label for="lastName">Last name</label><input type="text" name="lastName" id="lastName" value="">');
    } 

    if(this.includeEmail) {
      standardFields.push('<label for="email">Email</label><input type="text" name="email" id="email" value="">');
    }

    if(this.includePhone) {
      standardFields.push('<label for="phone">Phone</label><input type="text" name="phone" id="phone" value="">');
    }

    const customFields = this.selectedFields
      .map((field) => `<label for="field-${field.guid}">${field.label}</label>
  <input type="text" name="fields[${field.guid}]" id="field-${field.guid}" value="">`);

    const formFields = [...standardFields, ...customFields]
      .map((field) => `  <div class="form-field">${field}</div>`);

    const form = `
<form type="submit" method="post" action="${action.toString()}">
${formFields.join('\n')}

  <input type="hidden" name="redirectUrl" value="${this.redirectUrl}">

  <button type="submit">Submit</button>
</form>`;

    this._clipboard.copy(form.trim(), { showMessage: true });

    return of(null);
  };
}
