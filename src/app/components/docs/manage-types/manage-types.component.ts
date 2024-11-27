import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';


import { MatButtonModule } from '@angular/material/button';

import { FsDialog, FsDialogModule } from '@firestitch/dialog';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { map, Subject, takeUntil } from 'rxjs';

import { LeadDocumentTypeData } from '../../../data';
import { DocTypeComponent } from '../doc-type/doc-type.component';


@Component({
  templateUrl: './manage-types.component.html',
  styleUrls: ['./manage-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    MatButtonModule,

    FsListModule,
    FsDialogModule,
    FsSkeletonModule,
  ],
})
export class ManageTypesComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;

  private _dialog = inject(FsDialog);
  private _destroy$ = new Subject<void>();

  constructor(
    private _leadDocumentTypeData: LeadDocumentTypeData,
  ) { 
  }

  public openDocType(documentType: any): void {
    this._dialog.open(DocTypeComponent, {
      data: { documentType },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.list.reload();
      });
  }

  public ngOnInit(): void {
    this.listConfig = {
      status: false,
      paging: false,
      reload: false,
      style: 'card',
      actions: [
        {
          label: 'Add',
          click: () => {
            this.openDocType({});
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._leadDocumentTypeData.delete(data);
          },
          remove: {
            title: 'Delete document type',
            template: 'Are you sure you would like to delete this document type?',
          },
          label: 'Delete',
        },
      ],
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._leadDocumentTypeData 
            .put({ id: row.id, state: 'active' });
        },
      },
      fetch: (query) => {
        return this._leadDocumentTypeData.gets(query)
          .pipe(
            map((documentTypes) => ({ data: documentTypes })),
          );
      },
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
