import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FsSkeletonModule } from '@firestitch/skeleton';

import { CrmLead } from '../../../interfaces/crm-lead';
import { CrmNotesComponent } from '../../notes/notes.component';

import { ActivityComponent } from './activity';
import { SummaryProfileComponent } from './profile';
import { TasksComponent } from './tasks';


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

    SummaryProfileComponent,
    ActivityComponent,    
    CrmNotesComponent,
    TasksComponent,
  ],
})
export class SummaryComponent{

  @Input() public crmLead: CrmLead;

}
