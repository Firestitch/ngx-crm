import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTasksSummaryComponent } from '@firestitch/task';

import { CrmLead } from '../../../interfaces/crm-lead';
import { CrmNotesComponent } from '../../notes/notes.component';

import { ActivityComponent } from './activity';
import { SummaryProfileComponent } from './profile';


@Component({
  selector: 'app-crm-lead-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    
    FsSkeletonModule,
    FsTasksSummaryComponent,

    SummaryProfileComponent,
    ActivityComponent,    
    CrmNotesComponent,
  ],
})
export class SummaryComponent{

  @Input() public crmLead: CrmLead;

}
