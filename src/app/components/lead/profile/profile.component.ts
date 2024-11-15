import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FsDialogModule } from '@firestitch/dialog';
import {
  Field,
  FieldRendererConfig,
} from '@firestitch/field-editor';
import { FsFormDirective, FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { LeadData } from '../../../data';
import { CrmLead } from '../../../interfaces';
import { ChannelsComponent } from '../../channels';
import { LeadAssignedAccountComponent } from '../../lead-assigned-account';
import { LeadSourceComponent } from '../../lead-source';
import { LeadStatusComponent } from '../../lead-status';
import { ManageFieldsDialogComponent } from '../../manage-fields';


@Component({
  selector: 'app-crm-lead-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,

    FsFormModule,
    FsSkeletonModule,
    FsLabelModule,
    FsDialogModule,
    // FsFieldRendererModule,

    ChannelsComponent,
    LeadStatusComponent,
    LeadAssignedAccountComponent,
    LeadSourceComponent,
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild(FsFormDirective)
  public form: FsFormDirective;

  // @ViewChild(FieldRendererComponent)
  // public fieldRenderer: FieldRendererComponent;

  @Input('crmLead') public _crmLead: CrmLead;

  @Output() public crmLeadChange = new EventEmitter<CrmLead>();

  public crmLead: CrmLead;
  public fieldConfig: FieldRendererConfig;

  private _message = inject(FsMessage);
  private _cdRef = inject(ChangeDetectorRef);
  private _router = inject(Router);
  private _location = inject(Location);
  private _leadData = inject(LeadData);
  private _dialog = inject(MatDialog);
  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this._fetchData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public submit$ = () => {
    const crmLead = {
      ...this.crmLead,
      state: 'active',
    };

    return this.save$(crmLead);
  };

  public formDirty(): void {
    this.form.dirty();
  }

  public customizeLeadField(): void {
    this._dialog.open(ManageFieldsDialogComponent)
      .afterClosed()
      .pipe(
        switchMap(() => this._loadFields$()),
        tap(() => this._cdRef.markForCheck()),
      )
      .subscribe();
  }
  
  public save$(data) {
    return this._leadData
      .save({
        id: this.crmLead.id,
        ...data,
      })
      .pipe(
        tap((crmLead) => {
          if (this.crmLead.state === 'draft') {
            const url = this._router
              .parseUrl(`${window.location.pathname}/${crmLead.id}${window.location.search}`);
            this._location.replaceState(url.toString());
          }
          this.crmLead = {
            ...this.crmLead,
            ...crmLead,
          };
          this.crmLeadChange.emit(this.crmLead);
        }),
        // switchMap(() => this._leadData
        //   .putFields(this.crmLead.id, this.fieldRenderer.fields)),
        tap(() => {
          this._cdRef.markForCheck();
          this._message.success('Saved Changes');
        }),
      );
  }

  public save(data): void {
    this.save$(data).subscribe();
  }

  public close(value?): void {
    inject(MatDialogRef).close(value);
  }

  private _fetchData(): void {
    this._leadData
      .get(this._crmLead.id, {
        emailCrmChannels: true,
        phoneCrmChannels: true,
        statusAttributes: true,
        assignedAccounts: true,
        sourceAttributes: true,
      })
      .pipe(
        tap((crmLead) => {
          this.crmLead = { 
            ...crmLead, 
          };
        }),
        switchMap(() => this._loadFields$()),
        tap(() => {
          this._cdRef.markForCheck();
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _loadFields$(): Observable<Field[]> {
    return this._leadData
      .getFields(this.crmLead.id)
      .pipe(
        tap((fields) => {
          this.fieldConfig = {
            fields,
          };
        }),
      );
  }

}
