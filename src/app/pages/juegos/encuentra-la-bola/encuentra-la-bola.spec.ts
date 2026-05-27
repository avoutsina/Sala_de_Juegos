import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuentraLaBola } from './encuentra-la-bola';

describe('EncuentraLaBola', () => {
  let component: EncuentraLaBola;
  let fixture: ComponentFixture<EncuentraLaBola>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncuentraLaBola],
    }).compileComponents();

    fixture = TestBed.createComponent(EncuentraLaBola);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
