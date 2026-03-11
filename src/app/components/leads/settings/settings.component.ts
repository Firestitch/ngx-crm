import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsTabsModule } from '@firestitch/tabs';

import { ManageFieldsComponent } from '../../manage-fields';

import { GroupsComponent } from './groups';
import { ShowFieldsComponent } from './show-fields';


@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    FormsModule,

    MatTabsModule,
    MatDialogModule,

    FsTabsModule,
    FsFormModule,
    FsDialogModule,

    GroupsComponent,
    ManageFieldsComponent,
    ShowFieldsComponent,
  ],
})
export class SettingsComponent {

  public selectedTab: 'show-fields' | 'customize-fields' | 'groups' = 'show-fields';

  private _data = inject(MAT_DIALOG_DATA, { optional: true });

  public groupsEnabled: boolean = this._data?.groups?.enabled ?? true;

}
