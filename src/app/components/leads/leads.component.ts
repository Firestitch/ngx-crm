
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FsDateModule } from '@firestitch/date';
import { FsDialog } from '@firestitch/dialog';
import { Field, FsFieldViewerModule } from '@firestitch/field-editor';
import { ItemType } from '@firestitch/filter';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsPhoneModule } from '@firestitch/phone';

import { of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { LeadData } from '../../data';
import { CrmLead, CrmLeadsConfig, LeadsColumn } from '../../interfaces';
import { CrmLeadsService } from '../../services';
import { CrmLeadService } from '../../services/crm-lead.service';
import { FsCrmLeadComponent } from '../lead/lead.component';

import { LeadFormComponent } from './lead-form';
import { ColumnComponent } from './leads-column';
import { SettingsComponent } from './settings/settings.component';


@Component({
  selector: 'fs-crm-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    ColumnComponent,
    FsListModule,
    FsPhoneModule,
    FsFieldViewerModule,
    FsDateModule
],
  providers: [
    CrmLeadService,
    CrmLeadsService,
    LeadData,
  ],
})
export class FsCrmLeadsComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input()
  public leadRouterLink: string[];

  @Input()
  public config: CrmLeadsConfig;

  public listConfig: FsListConfig;
  public fields: Field[] = [];

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _leadData = inject(LeadData);
  private _fsDialog = inject(FsDialog);
  private _route = inject(ActivatedRoute);
  private _cdRef = inject(ChangeDetectorRef); 
  private _injector = inject(Injector);
  private _crmLeadsService = inject(CrmLeadsService);

  public get columns(): {
    title?: string;
    align?: 'left' | 'right' | 'center';
    component: Type<LeadsColumn>;
  }[] {
    return this._crmLeadsService.config.columns || [];
  }

  public ngOnInit(): void {
    this._crmLeadsService.init(this.config);    
    this._initList();
    this._initDialog();
  }
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public reload(): void {
    this.list.reload();
  }

  public openDialog(crmLead: CrmLead): void {
    of(null)
      .pipe(
        switchMap(() => {
          if (crmLead.id && this.leadRouterLink) {
            this._fsDialog
              .navigate([crmLead.id], {
                relativeTo: this._route,
              });

            return of(null);
          }

          return this._dialog
            .open(FsCrmLeadComponent, {
              data: {
                crmLead,
                config: this._crmLeadsService.crmLeadConfig,
              },
              injector: this._injector,
            })
            .afterClosed()
            .pipe(
              tap(() => {
                this.reload();
              }),
            );
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _initDialog(): void {
    this._fsDialog
      .dialogRef$(FsCrmLeadComponent)
      .pipe(
        switchMap((dialogRef) => dialogRef.afterClosed()),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.list.reload();
      });
  }

  private _initList(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
        ...(this._crmLeadsService.config.filters || []),
      ],
      actions: [
        ...(this._crmLeadsService.config.actions || []),
        {
          label: 'Create',
          click: () => {
            this.openDialog({});
          },
        },
        {
          menu: true,
          label: 'Settings',
          click: () => {
            this._dialog.open(SettingsComponent)
              .afterClosed()
              .pipe(
                takeUntil(this._destroy$),
              )
              .subscribe(() => {
                this.reload();
              });
          },
        },
        {
          menu: true,
          label: 'Lead form',
          click: () => {
            this._dialog.open(LeadFormComponent);
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._leadData.delete(data);
          },
          remove: {
            title: 'Delete lead',
            template: 'Are you sure you would like to delete this lead?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,
          ...this._crmLeadsService.fetchQuery(query),
          primaryEmailCrmChannels: true,
          primaryPhoneCrmChannels: true,
          leadsFields: true,
        };

        return this._leadData.gets(query, { key: null })
          .pipe(
            tap(({ fields }) => {
              this.fields = fields;
              this._cdRef.markForCheck();
            }),
            map(({ leads, paging }) => {
              const data = leads
                .map((lead) => {
                  const leadRouterLink = this.leadRouterLink ?
                    [...this.leadRouterLink, lead.id] :
                    null;

                  return {
                    ...lead,
                    leadRouterLink,
                  };
                });

              return { data, paging: paging };
            }),
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._leadData.put({ id: row.id, state: 'active' });
        },
      },
    };
  }

}

