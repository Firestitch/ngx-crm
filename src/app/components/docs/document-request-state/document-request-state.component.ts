
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FsChipModule } from '@firestitch/chip';
import { index } from '@firestitch/common';

import { DocumentRequestStates } from '../../../consts';


@Component({
  selector: 'fs-crm-document-request-state',
  templateUrl: './document-request-state.component.html',
  styleUrls: ['./document-request-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsChipModule
],
})
export class DocumentRequestStateComponent {

  @Input()
  public requestState: string;

  public DocumentRequestStateColors = index(DocumentRequestStates, 'value', 'color');
  public DocumentRequestStateNames = index(DocumentRequestStates, 'value', 'name');

}
