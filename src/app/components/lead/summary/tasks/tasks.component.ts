import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';


import { MatIconModule } from '@angular/material/icon';

import { FsListModule } from '@firestitch/list';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,

    MatIconModule,
    
    FsListModule,
  ],
})
export class TasksComponent  {

}

