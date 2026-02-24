import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';

import { of } from 'rxjs';

import { CrmGroup } from '../../../interfaces';
import { LeadGroupsComponent } from '../../lead-groups';


@Component({
  templateUrl: './add-to-group.component.html',
  styleUrls: ['./add-to-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    FsDialogModule,
    FsFormModule,
    LeadGroupsComponent,
  ],
})
export class AddToGroupComponent {

  public crmGroups: CrmGroup[] = [];

  private _dialogRef = inject(MatDialogRef);

  public submit$ = () => {
    this._dialogRef.close(this.crmGroups);

    return of(true);
  };

}
