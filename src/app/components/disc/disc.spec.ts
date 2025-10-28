import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disc } from './disc';

describe('Disc', () => {
  let component: Disc;
  let fixture: ComponentFixture<Disc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Disc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
