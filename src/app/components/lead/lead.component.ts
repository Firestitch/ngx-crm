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
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { FsAuditsModule } from '@firestitch/audit';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTabsModule } from '@firestitch/tabs';
import { FsTasksComponent } from '@firestitch/task';

import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { LeadData } from '../../data/lead.data';
import { FS_CRM_LEAD_CONFIG } from '../../injectors/crm-lead-config.injector';
import { FS_CRM_LEAD_ROOT_CONFIG } from '../../injectors/crm-lead-root-config.injector';
import { CrmLeadConfig } from '../../interfaces';
import { CrmLead } from '../../interfaces/crm-lead';
import { CrmLeadService } from '../../services/crm-lead.service';
import { CrmDocsComponent } from '../docs/docs.component';
import { CrmFilesComponent } from '../files/files.component';
import { FsCrmVisitsComponent } from '../visits/visits.component';

import { ProfileComponent } from './profile/profile.component';
import { SummaryComponent } from './summary/summary.component';
import { TabComponent } from './tab';

@Component({
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
    MatTabsModule,
    MatDialogModule,
    FsSkeletonModule,
    FsDialogModule,
    FsTabsModule,
    FsTasksComponent,
    FsAuditsModule,
    FsFormModule,

    CrmFilesComponent,
    ProfileComponent,
    SummaryComponent,
    CrmDocsComponent, 
    TabComponent,
    FsCrmVisitsComponent,
  ],
  providers: [
    { 
      provide: CrmLeadService, 
      useFactory: () => {
        return inject(CrmLeadService, { optional: true, skipSelf: true }) || new CrmLeadService();
      },
    },
  ],
})
export class FsCrmLeadComponent implements OnInit, OnDestroy {

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent; 

  @ViewChild(ProfileComponent)
  public profile: ProfileComponent; 

  public crmLead: CrmLead;
  public htmlEditorConfig: FsHtmlEditorConfig;
  public selected = 'summary';

  private _cdRef = inject(ChangeDetectorRef);
  private _route = inject(ActivatedRoute);
  private _leadData = inject(LeadData);
  private _config = inject(FS_CRM_LEAD_CONFIG, { optional: true });
  private _rootConfig = inject(FS_CRM_LEAD_ROOT_CONFIG, { optional: true });
  private _data = inject<{ crmLead: any, config: CrmLeadConfig }>(MAT_DIALOG_DATA, { optional: true });
  private _crmLeadService = inject(CrmLeadService);
  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    const config = {
      ...(this._rootConfig || {}),
      ...(this._config || {}),
      ...(this._data?.config || {}),
    };
    
    this._crmLeadService.init(config);
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public close(value?): void {
    inject(MatDialogRef).close(value);
  }

  public get crmLeadService(): CrmLeadService {
    return this._crmLeadService;
  }

  public submit$ = () => {
    if(this.selected === 'profile') {
      return this.profile.submit$();
    }

    return of(null);
  };

  public profileChange(crmLead: CrmLead): void {
    this.crmLead = {
      ...this.crmLead,
      ...crmLead,
    };
  }

  private _fetchData(): void {
    const leadId = this._route.snapshot.params.id || this._data.crmLead.id;

    of(null)
      .pipe(
        switchMap(() => {
          return this._leadData.get(leadId, {
            ...(this._config?.fetch?.query || {}),
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
