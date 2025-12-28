import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesList } from './places-list';

describe('PlacesList', () => {
  let component: PlacesList;
  let fixture: ComponentFixture<PlacesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
