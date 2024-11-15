import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FsDateModule } from '@firestitch/date';
import { FsDialog } from '@firestitch/dialog';
import { Field } from '@firestitch/field-editor';
import { ItemType } from '@firestitch/filter';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { LeadData } from '../../data';
import { FsCrmLeadComponent } from '../lead/lead.component';

import { SettingsComponent } from './settings/settings.component';


@Component({
  selector: 'fs-crm-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    
    FsListModule,
    // FsFieldViewerModule,
    FsDateModule,

    //CrmNotesComponent,
  ],
})
export class FsCrmLeadsComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input()
  public leadRouterLink: string[];

  public listConfig: FsListConfig;
  public fields: Field[] = [];

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _router = inject(Router); 
  private _location = inject(Location);
  private _leadData = inject(LeadData);
  private _fsDialog = inject(FsDialog);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
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

  public openDialog(crmLead: any): void {
    this._dialog.open(FsCrmLeadComponent, {
      data: {
        crmLead,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.reload();
        if (crmLead.state === 'draft' || !crmLead.state) {
          const url = this._router
            .parseUrl(`${window.location.pathname.replace(/\/\d+$/, '')}${window.location.search}`);
          this._location.replaceState(url.toString());
        }
      });
  }

  private _initDialog(): void {
    this._fsDialog.dialogRef$(FsCrmLeadComponent)
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
      ],
      actions: [
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
            // this._dialog.open(LeadFormComponent);
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._leadData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,
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
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._leadData.put({ id: row.id, state: 'active' });
        },
      },
    };
  }

}

