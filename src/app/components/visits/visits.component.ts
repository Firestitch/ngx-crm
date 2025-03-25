import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsDateModule } from '@firestitch/date';
import { FsDeviceModule } from '@firestitch/device';
import { ItemType } from '@firestitch/filter';
import { FsIpModule } from '@firestitch/ip';
import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { filter, map } from 'rxjs/operators';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VisitData } from '../../data';
import { CrmVisit } from '../../interfaces';

import { VisitComponent } from './components/visit/visit.component';


@Component({
  selector: 'fs-crm-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsListModule,
    FsDeviceModule,
    FsIpModule,
    FsDateModule,
  ],
})
export class FsCrmVisitsComponent implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @Input()
  public crmLeadId: number;

  public listConfig: FsListConfig;

  private readonly _visitData = inject(VisitData);
  private readonly _destroyRef = inject(DestroyRef);

  private _dialog = inject(MatDialog);

  public ngOnInit(): void {
    this._initListConfig();
  }

  public reload(): void {
    this.list.reload();
  }

  public openDialog(crmVisit: CrmVisit): void {
    this._dialog.open(VisitComponent, {
      data: { crmVisit },
    })
      .afterClosed()
      .pipe(
        filter((response) => !!response),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.reload());
  }


  private _initListConfig(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,
          devices: true,  
          ips: true,
          crmLeadId: this.crmLeadId,
        };

        return this._visitData.gets(query, { key: null })
          .pipe(
            map((response: any) => {
              return { data: response.crmVisits, paging: response.paging };
            }),
          );
      },
    };
  }

}

