import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { FsAuditsModule } from '@firestitch/audit';
import { FsDialogModule } from '@firestitch/dialog';
import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTabsModule } from '@firestitch/tabs';
import { FsTasksComponent } from '@firestitch/task';

import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { LeadData } from '../../data/lead.data';
import { CrmLead } from '../../interfaces/crm-lead';
import { CrmDocsComponent } from '../docs/docs.component';
import { CrmFilesComponent } from '../files/files.component';

import { ProfileComponent } from './profile/profile.component';
import { SummaryComponent } from './summary/summary.component';


@Component({
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    
    MatTabsModule,

    FsSkeletonModule,
    FsDialogModule,
    FsTabsModule,
    FsTasksComponent,
    FsAuditsModule,

    CrmFilesComponent,
    ProfileComponent,
    SummaryComponent,
    CrmDocsComponent, 
  ],
})
export class FsCrmLeadComponent implements OnInit, OnDestroy {

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent; 

  public crmLead: CrmLead;
  public htmlEditorConfig: FsHtmlEditorConfig;
  public selected = 'summary';

  private _cdRef = inject(ChangeDetectorRef);
  private _route = inject(ActivatedRoute);
  private _leadData = inject(LeadData);
  private _data = inject<{ crmLead: any }>(MAT_DIALOG_DATA, { optional: true });
  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public close(value?): void {
    inject(MatDialogRef).close(value);
  }

  private _fetchData(): void {
    const leadId = this._route.snapshot.params.id || this._data.crmLead.id;

    of(null)
      .pipe(
        switchMap(() => {
          return leadId
            ? this._leadData.get(leadId)
            : this._leadData.save({
              ...this._data.crmLead,
            });
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((crmLead) => {
        this.selected = leadId ? 'summary' : 'profile';
        this.crmLead = { 
          ...crmLead, 
        };

        this._cdRef.markForCheck();
      });
  }

}
