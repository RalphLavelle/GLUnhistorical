import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveImageComponent } from './responsive-image';

describe('ResponsiveImageComponent', () => {
  let component: ResponsiveImageComponent;
  let fixture: ComponentFixture<ResponsiveImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsiveImageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('placeId', 'test-place');
    fixture.componentRef.setInput('altText', 'Test image');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct image paths', () => {
    expect(component.smallSrc()).toBe('/photos/test-place/small.jpg');
    expect(component.mediumSrc()).toBe('/photos/test-place/medium.jpg');
    expect(component.largeSrc()).toBe('/photos/test-place/large.jpg');
  });

  it('should generate correct srcset', () => {
    const srcset = component.srcset();
    expect(srcset).toContain('/photos/test-place/small.jpg 576w');
    expect(srcset).toContain('/photos/test-place/medium.jpg 768w');
    expect(srcset).toContain('/photos/test-place/large.jpg 1280w');
  });
});

