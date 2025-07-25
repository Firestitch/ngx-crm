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

import { AttributeColor, AttributeConfig, FsAttributeConfig, FsAttributeModule } from '@firestitch/attribute';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { Field, FieldFile, FsFieldViewerModule, RendererAction } from '@firestitch/field-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsPhoneModule } from '@firestitch/phone';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


import { LeadData } from '../../../../data';
import { CrmLead } from '../../../../interfaces/crm-lead';
import { CrmLeadService } from '../../../../services';
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
  private _crmLeadService = inject(CrmLeadService);
  
  public ngOnInit(): void {
    this._fetchProfile$()
      .subscribe();

    this.attributeConfig = {
      name: 'Tag',
      class: 'crmLeadTag', 
      pluralName: 'Tags',
      backgroundColor: AttributeColor.Enabled,
    };

    this.fsAttributeConfig = this._crmLeadService
      .getAttributeConfig('crm/leads/tags');
  }

  public filePreviewDownload = (field: Field, fieldFile: FieldFile) => {
    return this._leadData
      .fieldAction(this.crmLead.id, {
        action: RendererAction.FilePreview,
        field, 
        data: { fieldFile }, 
      });
  };

  public get assignAccountEnabled(): boolean {
    return this._crmLeadService.assignAccount?.enabled;
  }

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
