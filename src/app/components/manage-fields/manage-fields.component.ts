import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import {
  EditorAction, Field, FieldEditorConfig,
  FsFieldEditorModule,
} from '@firestitch/field-editor';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FormData } from '../../data';


@Component({
  selector: 'app-crm-lead-manage-fields',
  templateUrl: './manage-fields.component.html',
  styleUrls: ['./manage-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    
    FsDialogModule,
    FsSkeletonModule,
    FsFieldEditorModule,
  ],
})
export class ManageFieldsComponent implements OnInit, OnDestroy {

  @Input() public scrollContainer: HTMLElement;

  public config: FieldEditorConfig;

  private _destroy$ = new Subject<void>();
  private _formData = inject(FormData);
  private _cdRef = inject(ChangeDetectorRef);
  private _message = inject(FsMessage);

  public ngOnInit(): void {
    this._formData.leadForm()
      .subscribe(({ fields }) => {
        this.config = {
          fields,
          action: (action: EditorAction, field: Field, data: any): Observable<any> => {
            return this._formData.leadFieldAction(field, action, data)
              .pipe(
                tap(() => this._message.success()),
              );
          },
          initField: (field: Field) => {
            return field;
          },
        };
        this._cdRef.markForCheck();
      });
  }
   
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
