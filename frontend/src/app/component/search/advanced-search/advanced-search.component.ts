import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  itemsTypes = [{
    name: 'track',
    icon: 'audiotrack'
  }, {
    name: 'album',
    icon: 'album'
  }, {
    name: 'artist',
    icon: 'people'
  }];

  query = {
    itemsTypes: ['track', 'album']
  }

  constructor() { }

  ngOnInit() {
  }

  search() {
    console.log(this.query);
  }
}
