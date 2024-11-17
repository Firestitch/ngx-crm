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
  FsGalleryConfig, FsGalleryItem, FsGalleryModule, GalleryLayout, GalleryThumbnailSize,
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
      ],
      info: false,
      layout: GalleryLayout.Flow,
      thumbnail: {
        width: 400,
        heightScale: .7,
        size: GalleryThumbnailSize.Cover,
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
    
                const item: FsGalleryItem = { 
                  name: leadFile.file.filename,
                  preview: leadFile.file.preview?.large,
                  url,
                  data: leadFile,
                };
    
                return item;
              });
            }),
          );
       
      },
    };
    
    // this.listConfig = {
    //   filters: [
    //     {
    //       name: 'keyword',
    //       type: ItemType.Keyword,
    //       label: 'Search',
    //     },
    //   ],
    //   rowActions: [
    //     {
    //       click: (data) => {
    //         return this._leadFileData
    //           .delete(this.objectId, data);
    //       },
    //       remove: {
    //         title: 'Confirm',
    //         template: 'Are you sure you would like to delete this record?',
    //       },
    //       label: 'Delete',
    //     },
    //   ],
    //   fetch: (query) => {
    //     query = {
    //       files: true,
    //       ...query,
    //     };
        
    //     return this._leadFileData.gets(this.objectId, query, { key: null })
    //       .pipe(
    //         map((response: any) => {
    //           const data = response.crmFiles;

    //           return { data, paging: response.paging };
    //         }),
    //       );
    //   },
    //   restore: {
    //     query: { state: 'deleted' },
    //     filterLabel: 'Show Deleted',
    //     menuLabel: 'Restore',
    //     reload: true,
    //     click: (row) => {
    //       return this._leadFileData 
    //         .put(this.objectId, { id: row.id, state: 'active' });
    //     },
    //   },
    // };
  }

}

