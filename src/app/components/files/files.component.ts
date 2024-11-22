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


import { FsApi } from '@firestitch/api';
import { FsDateModule } from '@firestitch/date';
import {
  FsGalleryConfig, FsGalleryItem, FsGalleryModule,
} from '@firestitch/gallery';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { LeadFileData } from '../../data/lead-file.data';


@Component({
  selector: 'fs-crm-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    FsListModule,
    FsDateModule,
    FsHtmlRendererModule,
    FsGalleryModule,
  ],
})
export class CrmFilesComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input()
  public objectId: number;

  public listConfig: FsListConfig;

  public galleryConfig: FsGalleryConfig;

  private _destroy$ = new Subject<void>();
  private _leadFileData = inject(LeadFileData);
  private _api = inject(FsApi);

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

  private _initList(): void {
    this.galleryConfig = {
      showChangeSize: false,
      showChangeView: false,
      reload: false,
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
            this._leadFileData
              .delete(this.objectId, item.data)
              .subscribe(() => {
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

