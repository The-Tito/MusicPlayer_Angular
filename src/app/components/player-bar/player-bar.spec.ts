import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBar } from './player-bar';

describe('PlayerBar', () => {
  let component: PlayerBar;
  let fixture: ComponentFixture<PlayerBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
