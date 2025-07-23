import { CommonModule } from '@angular/common';
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
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsApi, RequestMethod } from '@firestitch/api';
import { AttributeColor, AttributeConfig, FsAttributeConfig, FsAttributeModule } from '@firestitch/attribute';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { Field, FieldFile, FsFieldViewerModule, RendererAction } from '@firestitch/field-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsPhoneModule } from '@firestitch/phone';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';


import { LeadData } from '../../../../data';
import { CrmLead } from '../../../../interfaces/crm-lead';
import { LeadAssignedAccountComponent } from '../../../lead-assigned-account';
import { LeadStatusComponent } from '../../../lead-status';

import { SettingsComponent } from './settings';


@Component({
  selector: 'app-crm-lead-summary-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,

    MatIconModule,
    
    FsSkeletonModule,
    FsPhoneModule,
    FsAutocompleteChipsModule,
    FsLabelModule,
    FsAttributeModule,
    FsFieldViewerModule,

    LeadAssignedAccountComponent,
    LeadStatusComponent,
  ],
  providers: [
    LeadData,
  ],
})
export class SummaryProfileComponent implements OnInit, OnDestroy {

  @Input('crmLead') public _crmLead: CrmLead;
  @Output() public crmLeadChange = new EventEmitter<CrmLead>();

  public crmLead: CrmLead;
  public fields: Field[];
  public attributeConfig: AttributeConfig;
  public fsAttributeConfig: FsAttributeConfig;

  private _cdRef = inject(ChangeDetectorRef);
  private _leadData = inject(LeadData);
  private _destroy$ = new Subject<void>();
  private _message = inject(FsMessage);
  private _dialog = inject(MatDialog);
  private _api = inject(FsApi);
  
  public ngOnInit(): void {
    this._fetchProfile$()
      .subscribe();

    this.attributeConfig = {
      name: 'Tag',
      class: 'crmLeadTag', 
      pluralName: 'Tags',
      backgroundColor: AttributeColor.Enabled,
    };

    this.fsAttributeConfig = {
      attribute: {
        save: ({ attribute }) => {
          const method = attribute.id ? RequestMethod.Put : RequestMethod.Post;

          return this._api.request(method, 'crm/leads/tags', attribute, { key: null });
        },
        delete: (data) => {
          return this._api.delete(`crm/leads/tags/${data.id}`, data, { key: null });
        },
      },
      attributes: {
        fetch: (query) => {
          return this._api
            .get('crm/leads/tags',
              {
                data: query,
                key: null,
              })
            .pipe(
              map((response) => {
                return { data: response.attributes, paging: response.paging };
              }),
            );
        },
      },
    };
  }

  public filePreviewDownload = (field: Field, fieldFile: FieldFile) => {
    return this._leadData
      .fieldAction(this.crmLead.id, {
        action: RendererAction.FilePreview,
        field, 
        data: { fieldFile }, 
      });
  };

  public summaryProfileSettings(): void {
    this._dialog.open(SettingsComponent)
      .afterClosed()
      .pipe(
        switchMap(() => this._fetchProfile$()),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public close(value?): void {
    inject(MatDialogRef).close(value);
  }

  public statusAttributeChanged(attribute): void {
    this._leadData.save({
      id: this.crmLead.id,
      statusAttributeId: attribute?.id || null,
    })
      .subscribe(() => {
        this.crmLeadChange.emit(this.crmLead);
        this._message.success();
      });
  }

  public tagAttributeChanged(tagAttributes): void {
    this._leadData.save({
      id: this.crmLead.id,
      tagAttributes,
    })
      .subscribe(() => {
        this.crmLeadChange.emit(this.crmLead);
        this._message.success();
      });
  }

  public assignedAccountChanged(account): void {
    this._leadData.save({
      id: this.crmLead.id,
      assignedAccountId: account?.id || null,
    })
      .subscribe(() => {
        this.crmLeadChange.emit(this.crmLead);
        this._message.success();
      });
  }

  private _fetchProfile$(): Observable<CrmLead> {
    return this._leadData
      .get(this._crmLead.id, {
        primaryEmailCrmChannels: true,
        primaryPhoneCrmChannels: true,
        statusAttributes: true,
        assignedAccounts: true,
        tagAttributes: true,
        summaryProfileFields: true,
      }, { key: null })
      .pipe(
        tap(({ crmLead, fields }) => {
          this.fields = fields;
          this.crmLead = { 
            ...crmLead, 
          };
          
          this._cdRef.markForCheck();
        }),
        takeUntil(this._destroy$),
      );
  }
}
