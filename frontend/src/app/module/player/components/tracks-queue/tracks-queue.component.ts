import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Track } from '~types/play/play-track';

@Component({
  selector: 'app-tracks-queue',
  templateUrl: './tracks-queue.component.html',
  styleUrls: ['./tracks-queue.component.scss']
})
export class TracksQueueComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { currentTrack: Track, tracksQueue: Track[] }
  ) { }

  ngOnInit() {
  }

}
