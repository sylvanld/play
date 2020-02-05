import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemTypeComponent } from './select-item-type.component';

describe('SelectItemTypeComponent', () => {
  let component: SelectItemTypeComponent;
  let fixture: ComponentFixture<SelectItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
