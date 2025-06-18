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
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FsApi, RequestMethod } from '@firestitch/api';
import {
  Field,
  FieldFile,
  FieldRendererComponent,
  FieldRendererConfig,
  FsFieldRendererModule,
  RendererAction,
} from '@firestitch/field-editor';
import { FsFormDirective, FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { LeadData } from '../../../data';
import { CrmLeadState } from '../../../enums';
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
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm },
  ],
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
    FsFieldRendererModule,

    ChannelsComponent,
    LeadStatusComponent,
    LeadAssignedAccountComponent,
    LeadSourceComponent,
  ],
  providers: [
    LeadData,
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild(FieldRendererComponent)
  public fieldRenderer: FieldRendererComponent;

  @Input('crmLead') public _crmLead: CrmLead;

  @Output() public crmLeadChange = new EventEmitter<CrmLead>();

  public crmLead: CrmLead;
  public fieldConfig: FieldRendererConfig;

  private _message = inject(FsMessage);
  private _form = inject(FsFormDirective);
  private _cdRef = inject(ChangeDetectorRef);
  private _leadData = inject(LeadData);
  private _dialog = inject(MatDialog);
  private _api = inject(FsApi);
  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this._form.pristine();
    this._fetchData();
  }

  public formDirty(): void {
    this._form.dirty();
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

  public customizeLeadField(): void {
    this._dialog.open(ManageFieldsDialogComponent)
      .afterClosed()
      .pipe(
        switchMap(() => this._loadFields$()),
        tap(() => this._cdRef.markForCheck()),
      )
      .subscribe();
  }

  public get stateDraft(): boolean {
    return this.crmLead.state === String(CrmLeadState.Draft);
  }

  public save$(data) {
    return this._leadData
      .save({
        id: this.crmLead.id,
        state: this.stateDraft ? CrmLeadState.Active : this.crmLead.state,
        ...data,
      })
      .pipe(
        tap((crmLead) => {
          this.crmLead = {
            ...this.crmLead,
            ...crmLead,
          };

          this.crmLeadChange.emit(this.crmLead);
        }),
        switchMap(() => this._leadData
          .putFields(this.crmLead.id, this.fieldRenderer.fields)),
        tap(() => {
          this._cdRef.markForCheck();
          this._message.success('Saved changes');
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
    of(null)
      .pipe(
        switchMap(() => {
          if(!this._crmLead.id) {
            return of({});
          }

          return this._leadData
            .get(this._crmLead.id, {
              emailCrmChannels: true,
              phoneCrmChannels: true,
              urlCrmChannels: true,
              statusAttributes: true,
              assignedAccounts: true,
              sourceAttributes: true,
            });
        }),
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

  private get _crmLeadFieldsUrl(): (string | number)[] {
    return ['crm/leads', this.crmLead.id, 'fields'];
  }

  private _loadFields$(): Observable<Field[]> {
    return this._leadData
      .getFields(this.crmLead.id)
      .pipe(
        tap((fields) => {
          this.fieldConfig = {
            fields,
            action: (action: RendererAction, field, data: any): Observable<any> => {
              return this._api
                .post([...this._crmLeadFieldsUrl, 'action'], {
                  action,
                  data,
                  field,
                }, { key: null });
            },
            fileDownload: (field: Field, fieldFile: FieldFile) => {
              return this._api
                .createApiFile([...this._crmLeadFieldsUrl, 'download'],
                  {
                    method: RequestMethod.Post,
                    data: {
                      field,
                      data: {
                        fieldFile,
                      },
                    },
                  });
            },
            filePreviewDownload: (field: Field, fieldFile: FieldFile) => {
              return this._api
                .createApiFile([...this._crmLeadFieldsUrl, 'preview'],
                  {
                    method: RequestMethod.Post,
                    data: {
                      field,
                      data: {
                        fieldFile,
                      },
                    },
                  });
            },
          };
        }),
      );
  }

}
