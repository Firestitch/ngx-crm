import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { format } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


import { LeadLogData } from '../../../../data';
import { CrmLog } from '../../../../interfaces';


@Component({
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    FormsModule,
    CommonModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,

    FsDialogModule,
    FsSkeletonModule,
    FsFormModule,
    FsHtmlEditorModule,
  ],
})
export class LogComponent implements OnInit, OnDestroy {

  public crmLog: CrmLog;
  public types = [
    { name: 'Outgoing call', value: 'outgoingCall' },
    { name: 'Incoming call', value: 'incomingCall' },
    { name: 'Outgoing email', value: 'outgoingEmail' },
    { name: 'Incoming email', value: 'incomingEmail' },
    { name: 'Meeting', value: 'meeting' },
    { name: 'Other', value: 'other' },
  ];

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      crmLog: CrmLog;
      crmLeadId: number;
    },
    private _message: FsMessage,
    private _leadLogData: LeadLogData,
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

  public save = () => {
    const data = {
      ...this.crmLog,
    };

    return this._leadLogData
      .save(this._data.crmLeadId, data)
      .pipe(
        tap((crmLog) => {
          this.crmLog = {
            ...this.crmLog,
            ...crmLog,
          };

          this._cdRef.markForCheck();
          this._message.success('Saved Changes');
        }),
      );
  };

  private _fetchData(): void {
    of(this._data.crmLog)
      .pipe(
        switchMap((crmLog) => {
          return crmLog.id
            ? this._leadLogData  
              .get(this._data.crmLeadId, this._data.crmLog.id)
            : of({
              ...crmLog,
              title: format(new Date(), 'MMM d, yyyy'),
            });
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((crmLog) => {
        this.crmLog = { 
          ...crmLog,
        };

        this._cdRef.markForCheck();
      });
  }

}