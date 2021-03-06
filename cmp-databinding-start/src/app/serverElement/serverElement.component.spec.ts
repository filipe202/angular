/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ServerElementComponent } from './serverElement.component';

describe('ServerElementComponent', () => {
  let component: ServerElementComponent;
  let fixture: ComponentFixture<ServerElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
