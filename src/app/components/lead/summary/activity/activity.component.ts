import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ActivityConfig, FsActivitiesComponent, FsActivityPreviewDirective } from '@firestitch/activity';
import { FsChipModule } from '@firestitch/chip';
import { index } from '@firestitch/common';
import { FsFile } from '@firestitch/file';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsMenuModule } from '@firestitch/menu';
import { FsMessage } from '@firestitch/message';

import { concat, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { CrmLogTypes } from '../../../../consts';
import { LeadFileData } from '../../../../data';
import { CrmLogType } from '../../../../enums/crm-log-type.enum';
import { AddActivityMenuItem, CrmLead } from '../../../../interfaces';
import { CrmLeadService } from '../../../../services';
import { DocComponent } from '../../../docs/doc';
import { RequestComponent } from '../../../docs/request';
import { NoteComponent } from '../../../note';

import { LogComponent } from './../log';
import { ActivityTypePreviewComponent } from './components';


@Component({
  selector: 'app-crm-lead-summary-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,

    FsMenuModule,
    FsHtmlRendererModule,
    FsChipModule,
    FsActivitiesComponent,
    FsActivityPreviewDirective,
    ActivityTypePreviewComponent,
  ],
  providers: [
    LeadFileData,
  ],
})
export class ActivityComponent implements OnInit, OnDestroy {

  @ViewChild(FsActivitiesComponent)
  public activities: FsActivitiesComponent;

  @Input()
  public crmLead: CrmLead;

  public activityConfig: ActivityConfig;
  public menuActions: AddActivityMenuItem[];
  public CrmLogTypes = index(CrmLogTypes, 'value', 'name');

  private _leadFileData = inject(LeadFileData);
  private _destroy$ = new Subject<void>();
  private _message = inject(FsMessage);
  private _dialog = inject(MatDialog);
  private _crmLeadService = inject(CrmLeadService);

  public ngOnInit(): void {
    this.activityConfig = {
      apiPath: ['crm', 'leads', this.crmLead.id, 'activities'],
    };
    this._initMenuActions();
  }

  public get enabled(): boolean {
    return this._crmLeadService.config.activity?.enabled ?? true;
  }

  public get activityTypePreviews() {
    return this._crmLeadService.config.activity?.typePreviews ?? [];
  }

  public loadNew(): void {
    this.activities.loadMore();
  }

  public openLog(crmLog): Observable<CrmLead> {
    return this._dialog
      .open(LogComponent, {
        data: {
          crmLog,
          crmLeadId: this.crmLead.id,
        },
      })
      .afterClosed();
  }

  public openNote(crmNote): void {
    this._dialog.open(NoteComponent, {
      data: {
        crmNote,
        crmLeadId: this.crmLead.id,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.loadNew();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public close(value?): void {
    inject(MatDialogRef).close(value);
  }

  public clickMenuItem(item: AddActivityMenuItem): void {
    item.click(this.crmLead)
      .pipe(
        tap(() => {
          this.loadNew(); 
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _initMenuActions(): void {
    let menuActions: AddActivityMenuItem[] = [
      {
        label: 'Log',
        items: [
          {
            label: 'Call',
            click: () => {
              return this.openLog({
                type: CrmLogType.OutgoingCall,
              });
            },
          },
          {
            label: 'Email',
            click: () => {
              return this.openLog({
                type: CrmLogType.OutgoingEmail,
              });
            },
          },
        ],
      },
      {
        label: 'Document',
        items: [
          {
            label: 'Request',
            click: () => {
              return this._dialog.open(RequestComponent, {
                data: {
                  crmLeadId: this.crmLead.id,
                },
              })
                .afterClosed()
                .pipe(
                  tap(() => {
                    this.loadNew();
                  }),
                  takeUntil(this._destroy$),
                );
            },
          },
          {
            label: 'Create',
            click: () => {
              return this._dialog.open(DocComponent, {
                autoFocus: false,
                data: {
                  crmLeadId: this.crmLead.id,
                },
              })
                .afterClosed()
                .pipe(
                  tap(() => {
                    this.loadNew();
                  }),
                  takeUntil(this._destroy$),
                );
            },
          },
        ],
      },
      {
        label: 'File',
        items: [
          {
            label: 'Upload',
            type: 'file',
            multiple: true,
            fileSelected: (files: FsFile[]) => {
              const files$ = files.map((fsFile) => {
                return this._leadFileData.post(this.crmLead.id, fsFile.file);
              });

              concat(...files$)
                .subscribe(() => {
                  this.loadNew();
                  this._message.success();
                });
            },
          },
        ],
      },
    ];

    if (this._crmLeadService.config.activity?.getAddMenuItems) {
      menuActions = this._crmLeadService.config.activity.getAddMenuItems(menuActions);
    }

    this.menuActions = menuActions;
  }

}
