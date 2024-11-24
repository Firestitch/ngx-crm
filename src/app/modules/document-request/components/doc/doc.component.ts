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

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsDialogModule } from '@firestitch/dialog';
import {
  FieldRendererComponent, FieldRendererConfig, FsFieldRendererModule,
} from '@firestitch/field-editor';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { DocumentRequestData } from '../../data';


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
  public documentRequestItem;
  public documentRequest;
  public document;

  private _destroy$ = new Subject<void>();
  private _cdRef = inject(ChangeDetectorRef);
  private _dialogRef = inject(MatDialogRef);
  private _message = inject(FsMessage);
  private _documentRequestData = inject(DocumentRequestData);

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      documentRequestItem: any;
      documentRequest: any;
    },
  ) { 
    this.documentRequest = _data.documentRequest;
  }

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  
  public save = () => {
    const data = {
      fields: this.fieldRenderer.fields,
    };

    return this._documentRequestData
      .postDocumentRequestItem(this.documentRequest.guid, this._data.documentRequestItem.id, data)
      .pipe(
        tap((documentRequestItem) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(documentRequestItem);
        }),
      );
  };

  private _fetchData(): void {
    this._documentRequestData
      .getDocumentRequestItem(this.documentRequest.guid, this._data.documentRequestItem.id, {
        documentTypes: true,
      })
      .pipe(   
        tap((documentRequestItem) => {
          this.documentRequestItem = documentRequestItem;
        }),   
        switchMap((documentRequestItem) => this._loadFields$(documentRequestItem)),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  private _loadFields$(documentRequestItem) {
    return this._documentRequestData
      .getFields(this.documentRequest.guid, documentRequestItem.id)
      .pipe(
        tap((fields) => {
          this.fieldConfig = { 
            fields,
            // action:  (action: RendererAction, field: Field, data: any) => {
            //   return this._leadDocumentData
            //     .actionFields(this._data.crmLeadId, document.id, { field, action, data });
            // },
          };
        }),
      );
  }
}
