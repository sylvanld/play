import { Component, Input, HostBinding, Optional, Self, OnInit, OnDestroy } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FormControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';

interface ItemTypeFilter {
  name: string;
  icon: string;
}

@Component({
  selector: 'select-list',
  templateUrl: `./select-list.component.html`,
  styleUrls: ['./select-list.component.scss']
})
export class SelectList implements MatFormFieldControl<string[]>, OnInit, OnDestroy {

  // required but useless
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  @Input()
  get value(): string[] {
    return this.enabledFilters.value;
  }
  set value(v: string[]) {
    this.enabledFilters.setValue(v);
    this.stateChanges.next();
  }

  constructor(
    @Optional()
    @Self()
    public ngControl: NgControl
  ) { }

  // attribute unique id to this component
  static nextId = 0;
  required: boolean;
  disabled: boolean;
  errorState: boolean;
  controlType?: string;
  autofilled?: boolean;
  focused: boolean;
  empty: boolean;

  stateChanges = new Subject<void>();
  @HostBinding() id = `select-list-${SelectList.nextId++}`;


  @Input() placeholder: string;

  /* getters and setters for filter form control */
  @Input() filters: ItemTypeFilter[] = [];

  /* getters and setters for value of form control */
  enabledFilters = new FormControl();
  setDescribedByIds(ids: string[]): void {
    throw new Error('Method not implemented.');
  }
  onContainerClick(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() { }
  ngOnDestroy() {
    this.stateChanges.complete();
  }

  getFilter(name) {
    return this.filters.filter((filter) => filter.name === name)[0];
  }

}
