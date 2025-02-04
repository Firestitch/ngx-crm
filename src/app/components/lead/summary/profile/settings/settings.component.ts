import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsTabsModule } from '@firestitch/tabs';

import { ManageFieldsComponent } from '../../../../manage-fields';

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

    ManageFieldsComponent,
    ShowFieldsComponent,
  ],
})
export class SettingsComponent {

  public selectedTab = 'show-fields';

}
