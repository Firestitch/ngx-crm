import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsDialogModule } from '@firestitch/dialog';
import {
  Field,
  FieldFile,
  FieldRendererComponent,
  FieldRendererConfig,
  FsFieldRendererModule, RendererAction,
} from '@firestitch/field-editor';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { forkJoin, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


import { LeadDocumentData, LeadDocumentTypeData } from '../../../data';
import { DocTypeComponent } from '../doc-type/doc-type.component';
import { ManageTypesComponent } from '../manage-types/manage-types.component';


@Component({
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,

    FsDialogModule,
    FsLabelModule,
    FsAutocompleteChipsModule,
    FsFieldRendererModule,
    FsSkeletonModule,
    FsFormModule,
  ],
})
export class DocComponent implements OnInit, OnDestroy {

  @ViewChild(FieldRendererComponent)
  public fieldRenderer: FieldRendererComponent;

  public fieldConfig: FieldRendererConfig;
  public document;

  private _dialog = inject(MatDialog);
  private _destroy$ = new Subject<void>();
  private _leadDocumentTypeData = inject(LeadDocumentTypeData);

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      document: any;
      crmLeadId: number;
    },
    private _message: FsMessage,
    private _leadDocumentData: LeadDocumentData,
    private _cdRef: ChangeDetectorRef,
  ) { 
  }

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  
  public fetchDocumentTypes = (query: any) => {
    return this._leadDocumentTypeData.gets(query);
  };

  public manageDocumentTypes = () => {
    this._dialog.open(ManageTypesComponent);
  }; 

  public save = () => {
    const data = {
      ...this.document,
      state: 'active',
    };

    return this._leadDocumentData
      .save(this._data.crmLeadId, data)
      .pipe(
        switchMap((document) => 
          (
            this._leadDocumentData
              .putFields(this._data.crmLeadId, document.id, this.fieldRenderer.fields)
          )
            .pipe(
              tap(() => {
                this.document = {
                  ...this.document,
                  ...document,
                };
              }),
            ),
        ),
        tap(() => {
          this._cdRef.markForCheck();
          this._message.success('Saved Changes');
        }),
      );
  };

  public documentTypeChange(documentType) {
    const data = {
      ...this.document,
      documentTypeId: documentType?.id,
      name: documentType?.name,
      state: 'draft',
    };

    this._leadDocumentData
      .save(this._data.crmLeadId, data)
      .pipe(
        tap((document) => {
          this.document = {
            ...this.document,
            ...document,
          };
        }),
        switchMap((document) => this._loadFields$(document)),
        tap(() => {
          this._cdRef.markForCheck();
        }),
      )
      .subscribe();
  }

  public openDocumentType() {
    this._dialog.open(DocTypeComponent, {
      data: { documentType: this.document.documentType },
    })
      .afterClosed()
      .pipe(
        switchMap(() => this._loadFields$(this.document)),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  private _fetchData(): void {
    of({ ...this._data.document })
      .pipe(
        switchMap((document) => {
          if(!document.id) {
            return of({ document, fields: null });
          }
          
          return forkJoin(
            { 
              document: this._leadDocumentData
                .get(this._data.crmLeadId, document.id, {
                  documentTypes: true,
                }),
              fields: this._loadFields$(document),
            },
          );    
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(({ document }) => {
        this.document = document;
        this._cdRef.markForCheck();
      });
  }

  private _loadFields$(document) {
    return this._leadDocumentData
      .getFields(this._data.crmLeadId, document.id)
      .pipe(
        tap((fields) => {
          this.fieldConfig = { 
            fields,
            canFileDownload: () => {
              return of(true);
            },
            canFileDelete: () => {
              return of(true);
            },
            fileDownload: (field: Field, fieldFile: FieldFile) => {
              return this._leadDocumentData
                .fieldFileDownload(this._data.crmLeadId, document.id, {
                  action: null,
                  field, 
                  data: { fieldFile }, 
                });
            },
            action:  (action: RendererAction, field: Field, data: any) => {
              return this._leadDocumentData
                .actionFields(this._data.crmLeadId, document.id, { field, action, data });
            },
          };
        }),
      );
  }
}
