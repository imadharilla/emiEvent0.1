import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfirmComponent } from './event-confirm.component';

describe('EventConfirmComponent', () => {
  let component: EventConfirmComponent;
  let fixture: ComponentFixture<EventConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
