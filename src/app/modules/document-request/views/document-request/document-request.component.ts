
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { RouteObserver } from '@firestitch/core';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DocComponent } from '../../components/doc';


@Component({
  templateUrl: './document-request.component.html',
  styleUrls: ['./document-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    FsSkeletonModule
],
})
export class DocumentRequestComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _cdRef = inject(ChangeDetectorRef);


  public documentRequest = null;
  public documentRequest$: RouteObserver;

  private _dialog = inject(MatDialog);
  private _destroy$ = new Subject<void>();

  constructor() {
    this.documentRequest$ = new RouteObserver(this._route, 'documentRequest');
  }

  public uploadDocument(documentRequestItem) {
    this._dialog.open(DocComponent, {
      autoFocus: false,
      data: {
        documentRequestItem,
        documentRequest: this.documentRequest,
      },
    });
  }

  public ngOnInit(): void {
    this.documentRequest$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((documentRequest) => {
        this.documentRequest = documentRequest;
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
