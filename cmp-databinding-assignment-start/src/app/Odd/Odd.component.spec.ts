/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OddComponent } from './Odd.component';

describe('OddComponent', () => {
  let component: OddComponent;
  let fixture: ComponentFixture<OddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
