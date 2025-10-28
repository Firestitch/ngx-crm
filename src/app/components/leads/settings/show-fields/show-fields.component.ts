
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsChipModule } from '@firestitch/chip';
import { Field } from '@firestitch/field-editor';
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { forkJoin, Subject } from 'rxjs';

import { FormData, SettingData } from '../../../../data';


@Component({
  selector: 'app-crm-lead-settings-show-fields',
  templateUrl: './show-fields.component.html',
  styleUrls: ['./show-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    FormsModule,
    FsChipModule,
    FsSkeletonModule,
    FsFormModule
],
  providers: [
    SettingData,
  ],
})
export class ShowFieldsComponent implements OnInit, OnDestroy {
  
  public fields: Field[];
  public selectedFields: Field[] = [];
  public selectedTab = 'show-fields';

  private _destroy$ = new Subject<void>();
  private _formData = inject(FormData);
  private _cdRef = inject(ChangeDetectorRef);
  private _settingData = inject(SettingData);

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public selectedFieldsChange(fields: Field[]): void {
    this._settingData
      .postLeadsFields({
        fields: fields
          .map((field) => field.guid),
      })
      .subscribe();
  }

  private _fetchData(): void {
    forkJoin({
      leadsFields: this._settingData.leadsFields(),
      leadForm: this._formData.leadForm(),
    })
      .subscribe(({ leadsFields, leadForm }) => {
        this.fields = leadForm.fields
          .sort((a, b) => {
            const aIndex = leadsFields.fields.indexOf(a.guid);
            const bIndex = leadsFields.fields.indexOf(b.guid);

            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;

            return aIndex - bIndex;
          });

        this.selectedFields = this.fields
          .filter((field) => leadsFields.fields.includes(field.guid));
        this._cdRef.markForCheck();
      });
    
  }

}
