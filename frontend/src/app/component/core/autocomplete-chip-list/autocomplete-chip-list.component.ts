import { Component, Input, EventEmitter, ViewChild, ElementRef, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-autocomplete-chip-list',
  templateUrl: './autocomplete-chip-list.component.html',
  styleUrls: ['./autocomplete-chip-list.component.scss']
})
export class AutocompleteChipListComponent<ObjectType> {
  /* about items io */
  @Input()
  get items() {
    return this._items;
  }
  set items(_items: ObjectType[]) {
    this._items = _items;
    this.itemsChange.emit(this._items);
  }

  @Output() itemsChange = new EventEmitter();


  /* core attributes */
  @Input() placeholder = 'Replace me...';
  @ViewChild('itemInput', { static: false }) itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  itemCtrl = new FormControl();
  _items: ObjectType[] = [];
  itemsIds: string[] = [];
  filteredItems: ObjectType[] = [];

  // minimal delay between 2 requests to API
  timeout = 300;
  // last timestamp a character has been tiped
  lastTrigger: number;
  // used to trigger refreshes
  refreshRequired = new EventEmitter();

  constructor() {
    this.itemCtrl.valueChanges.subscribe(() => this.triggerRefresh());
    this.refreshRequired.subscribe((query: string) => this.refreshFilter(query));
  }

  triggerRefresh() {
    // function call when a character is tiped
    // determine whether an API call should be done to refresh filters
    setTimeout(() => {
      const now = new Date().getTime();
      if (this.lastTrigger && now - this.lastTrigger > this.timeout && this.itemCtrl.value && this.itemCtrl.value.length > 1) {
        this.refreshRequired.emit(this.itemCtrl.value);
      }
      this.lastTrigger = now;
    }, this.timeout);
  }

  refreshFilter(query: string) {
    // called the user's search function to retrieve a list of filtered items
    this.search(query).subscribe((objs: ObjectType[]) => {
      this.filteredItems = objs;
    });
  }

  clearInput() {
    // clear processed input
    this.itemInput.nativeElement.value = '';
    this.itemCtrl.setValue(null);
  }

  addItem(item: ObjectType) {
    this.items.push(item);
    this.filteredItems = [];
  }

  add(event: MatChipInputEvent) {
    console.log('add');
    if (!!this.matAutocomplete.isOpen && this.filteredItems.length > 0) {
      this.addItem(this.filteredItems[0]);
      this.clearInput();
      this.itemsChange.emit(this._items);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    console.log('selected');
    const item: ObjectType = event.option.value;
    if (!!item) {
      this.addItem(item);
      this.clearInput();
      this.itemsChange.emit(this._items);
    }
  }

  remove(item: ObjectType) {
    console.log('removed');
    console.log(item);

    const position = this.items.indexOf(item);

    if (position !== -1) {
      this.items.splice(position, 1);
      this.itemsChange.emit(this._items);
    }
  }

  // end user have to implement this method
  search(query: string): Observable<ObjectType[]> {
    throw new Error('Not Implemented method...');
  }

  // end user have to implement this method
  display(obj: ObjectType): { title: string, description?: string, icon?: string } {
    throw new Error('Not Implemented method...');
  }
}
