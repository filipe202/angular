/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameControlComponent } from './GameControl.component';

describe('GameControlComponent', () => {
  let component: GameControlComponent;
  let fixture: ComponentFixture<GameControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
