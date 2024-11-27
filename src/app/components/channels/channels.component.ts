import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';

import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { guid } from '@firestitch/common';
import { FsFormModule } from '@firestitch/form';
import { FsPhoneModule } from '@firestitch/phone';

import { Subject } from 'rxjs';

import { CrmChannel } from '../../interfaces';


@Component({
  selector: 'app-crm-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DragDropModule,

    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,

    FsPhoneModule,
    FsFormModule,
  ],
})
export class ChannelsComponent implements OnInit, OnDestroy {

  @Input() public type: 'email' | 'phone';
  @Input() public channels: CrmChannel[] = [];
  @Output() public channelsChange = new EventEmitter<CrmChannel[]>();

  public labels: string[] = [];

  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.channels = this.channels || [];
    this.labels = this.type === 'phone' ? [
      'mobile',
      'home',
      'work',
      'school',
      'home fax',
      'work fax',
      'other',
    ] : 
      ['home', 'work', 'school', 'other'];
  }

  public addChannel(): void {
    const label = this.labels
      .find((item) =>{
        return !this.channels.some((channel) => channel.label === item);
      });

    this.channels.push({
      value: '',
      label: label || 'other',
      guid: guid(),
    });
  }

  public removeChannel(index: number): void {
    this.channels.splice(index, 1);
    this.channelsChange.emit(this.channels);
  }

  public channelsChanged(): void {
    this.channelsChange.emit(this.channels);
  }

  public drop(event: CdkDragDrop<CrmChannel[]>) {
    moveItemInArray(this.channels, event.previousIndex, event.currentIndex);
    this.channelsChange.emit(this.channels);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
  

}
