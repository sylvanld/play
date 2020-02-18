import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Track } from '~types/play/play-track';

@Component({
  selector: 'app-tracks-queue',
  templateUrl: './tracks-queue.component.html',
  styleUrls: ['./tracks-queue.component.scss']
})
export class TracksQueueComponent implements OnInit {
  @Output() selection = new EventEmitter();

  constructor(
    private elementRef: MatBottomSheetRef<TracksQueueComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { currentTrack: Track, tracksQueue: Track[] }
  ) { }

  ngOnInit() {
  }

  public onSelection(index) {
    console.log('selection');
    this.selection.emit(index);
    this.elementRef.dismiss();
  }

}
