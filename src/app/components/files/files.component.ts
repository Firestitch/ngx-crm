
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


import { FsApi } from '@firestitch/api';
import { FsDateModule } from '@firestitch/date';
import { FsFile } from '@firestitch/file';
import {
  FsGalleryComponent,
  FsGalleryConfig, FsGalleryItem, FsGalleryModule,
} from '@firestitch/gallery';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsListConfig, FsListModule } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';

import { concat, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { LeadFileData } from '../../data/lead-file.data';


@Component({
  selector: 'fs-crm-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    FsListModule,
    FsDateModule,
    FsHtmlRendererModule,
    FsGalleryModule
],
  providers: [
    LeadFileData,
  ],
})
export class CrmFilesComponent implements OnInit, OnDestroy {

  @ViewChild(FsGalleryComponent)
  public gallery: FsGalleryComponent;

  @Input()
  public objectId: number;

  public listConfig: FsListConfig;

  public galleryConfig: FsGalleryConfig;

  private _destroy$ = new Subject<void>();
  private _prompt = inject(FsPrompt);
  private _leadFileData = inject(LeadFileData);
  private _api = inject(FsApi);

  public ngOnInit(): void {
    this._initGallery();
  }
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public reload(): void {
    this.gallery.reload();
  }

  private _initGallery(): void {
    this.galleryConfig = {
      showChangeSize: false,
      showChangeView: false,
      reload: false,
      upload: {
        label: 'Upload',
        icon: 'upload',
        multiple: true,
        select: (files: FsFile[]) => {
          const files$ = files.map((fsFile) => {
            return this._leadFileData
              .post(this.objectId, fsFile.file);
          });

          return concat(...files$);
        },
      },
      itemActions: [
        {
          label: 'Download',
          download: true,
          tooltip: 'Download',
          icon: 'download',
        },
        {
          label: 'Delete',
          icon: 'delete',
          click: (item: FsGalleryItem) => {
            this._prompt
              .delete({
                objectType: 'file',
              })
              .pipe(
                switchMap(() => this._leadFileData.delete(this.objectId, item.data)),
                takeUntil(this._destroy$),
              )
              .subscribe(() => {
                this.gallery.galleryService.closePreview();
                this.reload();
              });
          },
        },

      ],
      info: false,
      thumbnail: {
        width: 400,
        heightScale: .7,
      },
      fetch: (query): Observable<FsGalleryItem[]> => {
        query = {
          ...query,
          files: true,
        };

        return this._leadFileData.gets(this.objectId, query)
          .pipe(
            map((leadFiles) => {
              return leadFiles.map((leadFile) => {
                const url = this._api
                  .createApiFile(`crm/leads/${leadFile.objectId}/files/${leadFile.id}/download`);

                const preview = this._api
                  .createApiFile(`crm/leads/${leadFile.objectId}/files/${leadFile.id}/preview`);
    
                const item: FsGalleryItem = { 
                  guid: String(leadFile.id),
                  name: leadFile.file.filename,
                  url,
                  preview,
                  data: leadFile,
                };
    
                return item;
              });
            }),
          );
       
      },
    };
  }

}

