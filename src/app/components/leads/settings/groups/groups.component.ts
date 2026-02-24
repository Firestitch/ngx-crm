import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { FsChipModule } from '@firestitch/chip';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GroupData } from '../../../../data';
import { CrmGroup } from '../../../../interfaces';

@Component({
  selector: 'app-crm-lead-settings-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    FsChipModule,
    FsFormModule,
    FsLabelModule,
    FsSkeletonModule,
  ],
  providers: [GroupData],
})
export class GroupsComponent implements OnInit, OnDestroy {
  public groups: CrmGroup[] = [];
  public groupsLoaded = false;
  public editing: CrmGroup | null = null;
  public formModel: Partial<CrmGroup> = {};

  private _cdRef = inject(ChangeDetectorRef);
  private _groupData = inject(GroupData);
  private _message = inject(FsMessage);
  private _dialog = inject(MatDialog);
  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this._load();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public add(): void {
    this.editing = null;
    this.formModel = { name: '', color: '' };
    this._cdRef.markForCheck();
  }

  public edit(group: CrmGroup): void {
    this.editing = group;
    this.formModel = { id: group.id, name: group.name ?? '', color: group.color ?? '' };
    this._cdRef.markForCheck();
  }

  public cancel(): void {
    this.editing = null;
    this.formModel = {};
    this._cdRef.markForCheck();
  }

  public save(): void {
    if (!this.formModel.name?.trim()) {
      return;
    }
    this._groupData
      .save({ id: this.formModel.id, name: this.formModel.name.trim(), color: this.formModel.color || undefined })
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this._message.success();
          this.cancel();
          this._load();
        },
        error: () => this._cdRef.markForCheck(),
      });
  }

  public deleteGroup(group: CrmGroup): void {
    if (!confirm(`Are you sure you want to delete "${group.name}"?`)) {
      return;
    }
    this._groupData
      .delete(group)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this._message.success();
          this._load();
        },
        error: () => this._cdRef.markForCheck(),
      });
  }

  private _load(): void {
    this.groupsLoaded = false;
    this._cdRef.markForCheck();
    this._groupData
      .gets({}, { key: null })
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: { crmGroups?: CrmGroup[] } | CrmGroup[]) => {
        this.groups = Array.isArray(res) ? res : (res?.crmGroups ?? []);
        this.groupsLoaded = true;
        this._cdRef.markForCheck();
      });
  }
}
