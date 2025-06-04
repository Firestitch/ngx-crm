import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { format } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


import { LeadNoteData } from '../../data';
import { CrmNote } from '../../interfaces';


@Component({
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,

    FsDialogModule,
    FsSkeletonModule,
    FsFormModule,
    FsHtmlEditorModule,
  ],
  providers: [
    LeadNoteData,
  ],
})
export class NoteComponent implements OnInit, OnDestroy {

  public crmNote: CrmNote;
  public content: string;

  private _data = inject(MAT_DIALOG_DATA);
  private _message = inject(FsMessage);
  private _leadNoteData = inject(LeadNoteData);
  private _cdRef = inject(ChangeDetectorRef);


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
      ...this.crmNote,
      content: this.content,
    };

    return this._leadNoteData
      .save(this._data.crmLeadId, data)
      .pipe(
        tap((crmNote) => {
          this.crmNote = {
            ...this.crmNote,
            ...crmNote,
          };

          this._cdRef.markForCheck();
          this._message.success('Saved changes');
        }),
      );
  };

  private _fetchData(): void {
    of(this._data.crmNote)
      .pipe(
        switchMap((crmNote) => {
          return crmNote.id
            ? this._leadNoteData
              .get(this._data.crmLeadId, this._data.crmNote.id, { crmNoteVersions: true })
            : of({
              ...crmNote,
              title: format(new Date(), 'MMM d, yyyy'),
            });
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((crmNote) => {
        this.content = crmNote.crmNoteVersion?.content;
        this.crmNote = {
          ...crmNote,
        };

        this._cdRef.markForCheck();
      });
  }

}
