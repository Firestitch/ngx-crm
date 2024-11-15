import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsActivitiesComponent, FsActivityPreviewDirective } from '@firestitch/activity';
import { FsChipModule } from '@firestitch/chip';
import { FsFile } from '@firestitch/file';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { concat, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import { ActivityData } from '@common/data';

// import { ActivitiesModule } from '@libs/activities';
// import { ActivitiesComponent } from '@libs/activities/components';

import { LeadFileData } from '../../../data';
import { CrmLead } from '../../../interfaces/crm-lead';
import { DocComponent } from '../../docs/doc/doc.component';
import { RequestComponent } from '../../docs/request/request.component';
import { NoteComponent } from '../../note/note.component';
import { CrmNotesComponent } from '../../notes/notes.component';

import { LogComponent } from './log';
import { SummaryProfileComponent } from './profile';
import { TasksComponent } from './tasks';


@Component({
  selector: 'app-crm-lead-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,
    
    FsSkeletonModule,
    FsHtmlRendererModule,
    FsActivitiesComponent, 
    FsActivityPreviewDirective,
    FsChipModule,

    SummaryProfileComponent,
    
    
    CrmNotesComponent,
    TasksComponent,
  ],
})
export class SummaryComponent implements OnInit, OnDestroy {

  // @ViewChild(ActivitiesComponent)
  // public activities: ActivitiesComponent;

  @Input() public crmLead: CrmLead;

  public menuActions: any[];

  private _leadFileData = inject(LeadFileData);
  //private _activitiesData = inject(ActivityData); 
  private _destroy$ = new Subject<void>();
  private _message = inject(FsMessage);
  private _dialog = inject(MatDialog);
  
  public ngOnInit(): void {
    this.menuActions = [
      {
        label: 'Log',
        items: [
          {
            label: 'Call',
            click: () => {
              this.openLog({
                type: 'outgoingCall',
              });
            },
          },
          {
            label: 'Email',
            click: () => {
              this.openLog({
                type: 'outgoingEmail',
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
              this._dialog.open(RequestComponent, {
                data: {
                  crmLeadId: this.crmLead.id,
                },
              });
            },
          },
          {
            label: 'Create',
            click: () => {
              this._dialog.open(DocComponent, {
                data: {
                  crmLeadId: this.crmLead.id,
                },
              });
            },
          },
        ],
      },
      {
        label: 'File',
        items: [
          {
            label: 'Upload',
            mode: 'file',
            multiple: true,
            fileSelected: (files: FsFile[]) => {
              const files$ = files.map((fsFile) => {
                return this._leadFileData.post(this.crmLead.id, fsFile.file);
              });

              concat(...files$)
                .subscribe(() => {
                  this.reloadActivities();
                  this._message.success();
                });
            },
          },
        ],
      },
    ];
  }

  public reloadActivities(): void {
    // this.activities.loadNew();
  }

  public openLog(crmLog): void {
    this._dialog.open(LogComponent, {
      data: {
        crmLog,
        crmLeadId: this.crmLead.id,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.reloadActivities();
      });
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
        this.reloadActivities();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public close(value?): void {
    inject(MatDialogRef).close(value);
  }

  // public loadActivities = (query) => {
  //   return this._activitiesData
  //     .gets(query, { key: null });
  // };
}
