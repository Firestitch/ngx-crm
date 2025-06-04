import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsClipboardModule } from '@firestitch/clipboard';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { forkJoin, of, Subject } from 'rxjs';
import { defaultIfEmpty, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { LeadDocumentData, LeadDocumentRequestData, LeadDocumentTypeData } from '../../../data';


@Component({
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,

    FsDialogModule,
    FsAutocompleteChipsModule,
    FsSkeletonModule,
    FsClipboardModule,
    FsLabelModule,
    FsFormModule,
  ],
  providers: [
    LeadDocumentData,
    LeadDocumentTypeData,
    LeadDocumentRequestData,
  ],
})
export class RequestComponent implements OnInit, OnDestroy {

  public selectedRequestObjects;
  public documentRequest: any;

  private _destroy$ = new Subject<void>();
  private _leadDocumentData = inject(LeadDocumentData);
  private _leadDocumentTypeData = inject(LeadDocumentTypeData);
  private _leadDocumentRequestData = inject(LeadDocumentRequestData);
  private _message = inject(FsMessage);
  private _cdRef = inject(ChangeDetectorRef);
  private _requestObjects;
  private _data = inject<{ 
    crmLeadId: number,
    documentRequest: any
   }>(MAT_DIALOG_DATA);

  public groupBy = (object: any) => {
    return object.groupLabel;
  };

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  
  public fetchDocumentTypes = (keyword: string) => {
    return of(this._requestObjects)
      .pipe(
        switchMap(() => {
          if(this._requestObjects) {
            return of(this._requestObjects);
          }

          return forkJoin({
            documents: this._leadDocumentData.gets(this._data.crmLeadId),
            documentTypes: this._leadDocumentTypeData.gets(),
          })
            .pipe(
              map(({ documents, documentTypes }) => {
                return [
                  ...documents.map((item) => ({ 
                    ...item, 
                    groupLabel: 'Existing',  
                    group: 'existing',  
                     
                  })),
                  ...documentTypes.map((item) => ({ 
                    ...item, 
                    groupLabel: 'New', 
                    group: 'new', 
                  })),
                ];
              }),
              tap((requestObjects) => {
                this._requestObjects = requestObjects;
              }),
            );
        }),
        map((requestObjects) => requestObjects
          .filter((requestObject) => {
            return !keyword || String(requestObject.name)
              .toLowerCase()
              .includes(keyword.toLowerCase());
          }),
        ),
      );
  };

  public get url(): string {
    const url = new URL(window.location.origin);
    url.pathname = `/documentrequest/${this.documentRequest.guid}`;

    return url.toString();
  }

  public save = () => {
    return of(null)
      .pipe(
        switchMap(() => {
          return forkJoin(
            ...this.selectedRequestObjects
              .filter((item) => item.group === 'new')
              .map((item) => this._leadDocumentData
                .post(this._data.crmLeadId, {
                  documentTypeId: item.id,
                })),
          )
            .pipe(defaultIfEmpty([]));
        }),
        switchMap((documents) => {
          const data = {
            documents: [
              ...documents,
              ...this.selectedRequestObjects
                .filter((item) => item.group === 'existing'),
            ],
          };

          return this._leadDocumentRequestData
            .save(this._data.crmLeadId, data)
            .pipe(
              tap((documentRequest) => {
                this.documentRequest = documentRequest;
                this._cdRef.markForCheck();
                this._message.success('Saved Changes');
              }),
            );
        }),
      );
  };

  private _fetchData(): void {
    of(this._data?.documentRequest || {})
      .pipe(
        switchMap((documentRequest) => {
          return documentRequest.id
            ? this._leadDocumentTypeData
              .get(documentRequest.id)
            : of({ documentRequest, fields: null });
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((documentRequest) => {
        this.documentRequest = { 
          ...documentRequest,
        };

        this._cdRef.markForCheck();
      });
  }

}
