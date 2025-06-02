import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTasksSummaryComponent } from '@firestitch/task';

import { CrmLead } from '../../../interfaces/crm-lead';
import { CrmLeadService } from '../../../services/crm-lead.service';
import { CrmNotesComponent } from '../../notes/notes.component';
import { SecondaryContainerComponent } from '../secondary-container';

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
    SecondaryContainerComponent,
    ActivityComponent,    
    CrmNotesComponent,
  ],
})
export class SummaryComponent{

  @Input() public crmLead: CrmLead;

  private _crmLeadService = inject(CrmLeadService);

  public get crmLeadService(): CrmLeadService {
    return this._crmLeadService;
  }

}
