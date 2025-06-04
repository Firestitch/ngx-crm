import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsGalleryComponent, FsGalleryItem } from '@firestitch/gallery';
import { FsMessage } from '@firestitch/message';

import { of } from 'rxjs';

import { DocumentRequestStates } from '../../../consts';
import { LeadDocumentData } from '../../../data';


@Component({
  selector: 'app-doc-gallery-details',
  templateUrl: './doc-gallery-details.component.html',
  styleUrls: ['./doc-gallery-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,

    FsAutocompleteChipsModule,
  ],
  providers: [
    LeadDocumentData,
  ],
})
export class DocGalleryDetailsComponent implements OnInit {

  @Input()
  public objectId: number;

  @Input()
  public item: FsGalleryItem;

  public requestStateObject: any;
  public document;

  private _gallery = inject(FsGalleryComponent);
  private _leadDocumentData = inject(LeadDocumentData);
  private _message = inject(FsMessage);

  public ngOnInit(): void {
    this.document = this.item.data;
    this.requestStateObject = DocumentRequestStates
      .find((state) => state.value === this.document.requestState);
  }

  public fetchRequestStates = () => {
    return of([
      {
        name: 'None',
        value: null,
      },
      ...DocumentRequestStates,
    ]);
  };

  public compareRequestState = (a, b) => {
    return a?.value === b?.value;
  };

  public saveRequestState(requestState)  {
    this._leadDocumentData
      .put(this.objectId, {
        id: this.document.id,
        requestState: requestState?.value || null,
      })
      .subscribe(() => {
        this.document.requestState = requestState?.value || null;
        this._gallery.updateItemData(this.item, this.document);
        this._message.success();
      });
  }
}
