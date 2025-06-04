import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VisitData } from '../../../../data';
import { CrmVisit } from '../../../../interfaces';


@Component({
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    FsDialogModule,
    FsFormModule,
    FsSkeletonModule,
    JsonPipe,
  ],
  viewProviders: [
    VisitData,
  ],
})
export class VisitComponent implements OnInit {

  public crmVisit: CrmVisit;

  private readonly _data = inject(MAT_DIALOG_DATA);

  private readonly _dialogRef: MatDialogRef<VisitComponent> = inject(MatDialogRef);
  private readonly _visitData = inject(VisitData);
  private readonly _cdRef = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this._fetchData();
  }

  public close(value?): void {
    this._dialogRef.close(value);
  }

  private _fetchData(): void {
    of(this._data.crmVisit)
      .pipe(
        switchMap((crmVisit) => {
          return crmVisit.id
            ? this._visitData.get(crmVisit.id)
            : of(crmVisit);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((crmVisit) => {
        this.crmVisit = { ...crmVisit };

        this._cdRef.markForCheck();
      });
  }

}
