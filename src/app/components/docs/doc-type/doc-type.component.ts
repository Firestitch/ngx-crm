import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { FsDialogModule } from '@firestitch/dialog';
import { EditorAction, Field, FieldEditorConfig } from '@firestitch/field-editor';
import { FsFormModule } from '@firestitch/form';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


import { LeadDocumentTypeData } from '../../../data/lead-document-type.data';


@Component({
  templateUrl: './doc-type.component.html',
  styleUrls: ['./doc-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,

    FsDialogModule,
    //FsFieldEditorModule,
    FsSkeletonModule,
    FsFormModule,
  ],
})
export class DocTypeComponent implements OnInit, OnDestroy {

  public documentType;
  public content: string;
  public fieldConfig: FieldEditorConfig;

  private _leadDocumentTypeData = inject(LeadDocumentTypeData);
  private _message = inject(FsMessage);
  private _cdRef = inject(ChangeDetectorRef);
  private _data = inject<{ documentType: any }>(MAT_DIALOG_DATA);
  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save = () => {
    const data = {
      ...this.documentType,
      content: this.content,
    };

    return this._leadDocumentTypeData
      .save(data)
      .pipe(
        tap((documentType) => {
          this.documentType = {
            ...this.documentType,
            ...documentType,
          };

          this._cdRef.markForCheck();
          this._message.success('Saved Changes');
        }),
      );
  };

  private _loadFields$(documentType) {
    return this._leadDocumentTypeData.getFields(documentType)
      .pipe(
        tap((fields) => {
          this.fieldConfig = {
            fields,
            action: (action: EditorAction, field: Field, data: any): Observable<any> => {
              return this._leadDocumentTypeData
                .actionField(documentType, field, action, data)
                .pipe(
                  tap(() => this._message.success()),
                );
            },
            initField: (field: Field) => {
              return field;
            },
          };
        }),
      );
  }

  private _fetchData(): void {
    of(this._data?.documentType || {})
      .pipe(
        switchMap((documentType) => {
          return documentType.id
            ? forkJoin({
              documentType: this._leadDocumentTypeData
                .get(documentType.id),
              fields: this._loadFields$(documentType),
            })
            : of({ documentType, fields: null });
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(({ documentType }) => {
        this.documentType = { 
          ...documentType,
        };

        this._cdRef.markForCheck();
      });
  }

}