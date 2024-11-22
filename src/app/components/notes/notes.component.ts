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
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FsActivityObjectTypeComponent } from '@firestitch/activity';
import { FsDateModule } from '@firestitch/date';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';


import { LeadNoteData } from '../../data';
import { NoteComponent } from '../note';


@Component({
  selector: 'fs-crm-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    FsListModule,
    FsDateModule,
    FsHtmlRendererModule,

    FsActivityObjectTypeComponent,
  ],
})
export class CrmNotesComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input()
  public objectId: number;

  public listConfig: FsListConfig;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _leadNoteData = inject(LeadNoteData);

  public ngOnInit(): void {
    this._initList();
  }
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public reload(): void {
    this.list.reload();
  }

  public openDialog(crmNote: any): void {
    this._dialog.open(NoteComponent, {
      data: {
        crmNote,
        crmLeadId: this.objectId,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.reload();
      });
  }

  private _initList(): void {
    this.listConfig = {
      status: false,
      paging: false,
      style: 'basic',
      rowHoverHighlight: false,
      rowActionsHover: true,
      rowActions: [
        {
          click: (data) => {
            return this._leadNoteData
              .delete(this.objectId, data);
          },
          remove: {
            title: 'Delete n  ote',
            template: 'Are you sure you would like to delete this note?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        query = {
          crmNoteVersions: true,
          modifyAccounts: true,
          order: 'modify_date,desc',
          ...query,
        };
        
        return this._leadNoteData.gets(this.objectId, query, { key: null })
          .pipe(
            map((response: any) => {
              const data = response.crmNotes;

              return { data, paging: response.paging };
            }),
          );
      },
      // restore: {
      //   query: { state: 'deleted' },
      //   filterLabel: 'Show Deleted',
      //   menuLabel: 'Restore',
      //   reload: true,
      //   click: (row) => {
      //     return this._leadNoteData 
      //       .put(this.objectId, { id: row.id, state: 'active' });
      //   },
      // },
    };
  }

}

