import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FsApi } from '@firestitch/api';
import { FsDateModule } from '@firestitch/date';
import {
  FsGalleryConfig, FsGalleryItem,
} from '@firestitch/gallery';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { LeadDocumentData } from '../../data';

import { DocGalleryDetailsComponent } from './doc-gallery-details';
import { DocComponent } from './doc/doc.component';
import { DocumentRequestStateComponent } from './document-request-state';
import { RequestComponent } from './request';


@Component({
  selector: 'fs-crm-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,

    FsListModule,
    FsLabelModule,
    FsDateModule,
    FsHtmlRendererModule,
    //FsGalleryModule,

    DocumentRequestStateComponent,
    DocGalleryDetailsComponent,
  ],
})
export class CrmDocsComponent implements OnInit, OnDestroy {

  // @ViewChild(FsGalleryComponent)
  // public gallery: FsGalleryComponent;

  @Input()
  public objectId: number;

  public galleryConfig: FsGalleryConfig;

  private _destroy$ = new Subject<void>();
  private _leadDocumentData = inject(LeadDocumentData);
  private _dialog = inject(MatDialog);
  private _api = inject(FsApi);
  public ngOnInit(): void {
    this._initList();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public openDocument = (document) => {
    this._dialog.open(DocComponent, {
      data: {
        document,
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
  };

  public reload(): void {
    //this.gallery.reload();
  }

  private _initList(): void {
    const actions = [
      {
        icon: 'edit',
        label: 'Edit',
        click: (item: FsGalleryItem) => {
          this.openDocument(item.data);
        },
      },
      {
        icon: 'delete',
        label: 'Delete',
        click: (item: FsGalleryItem) => {
          this._leadDocumentData.delete(this.objectId, item.data)
            .subscribe(() => {
              this.reload();
            });
        },
      },
      {
        icon: 'download',
        label: 'Download',
        download: true,
      },
    ];

    this.galleryConfig = {
      showChangeSize: false,
      showChangeView: false,
      reload: false,
      itemActions: actions,
      details: {
        autoOpen: true,
      },
      thumbnail: {
        width: 400,
        heightScale: .7,
      },
      actions: [
        {
          label: 'Request',
          primary: false,
          click: () => {
            this._dialog.open(RequestComponent, {
              data: {
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
          },
        },
        {
          label: 'Create',
          primary: false,
          click: () => {
            this.openDocument({});
          },
        },
      ],
      fetch: (query): Observable<FsGalleryItem[]> => {
        query = {
          ...query,
          documentTypes: true,
        };

        return this._leadDocumentData
          .gets(this.objectId, query)
          .pipe(
            map((documents) => {
              return documents.map((document) => {
                const url = this._api
                  .createApiFile(`crm/leads/${document.objectId}/documents/${document.id}/download`);

                const preview = document.previewFileId ? this._api
                  .createApiFile(`crm/leads/${document.objectId}/documents/${document.id}/preview`) : 
                  null;
    
                const item: FsGalleryItem = { 
                  name: document.name || document.documentType.name,
                  preview,
                  url,
                  mime: {
                    type: null,
                    extension: 'pdf',
                  },
                  data: document,
                };
    
                return item;
              });
            }),
          );
       
      },
    };
  }

}
