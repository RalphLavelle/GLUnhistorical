import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ResponsiveImageComponent
 * 
 * A reusable component for displaying responsive images that automatically
 * selects the appropriate image size based on viewport width.
 * 
 * Uses srcset and sizes attributes for optimal performance and bandwidth usage.
 */
@Component({
  selector: 'app-responsive-image',
  imports: [CommonModule],
  templateUrl: './responsive-image.html',
  styleUrl: './responsive-image.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsiveImageComponent {
  // Required input: the place ID used to construct image paths
  placeId = input.required<string>();
  
  // Required input: alt text for accessibility
  altText = input.required<string>();
  
  // Optional input: CSS class to apply to the image
  cssClass = input<string>('');

  /**
   * Computed signal for small image path
   * Constructs path: /photos/{placeId}/small.jpg
   */
  smallSrc = computed(() => `/photos/${this.placeId()}/small.jpg`);

  /**
   * Computed signal for medium image path
   * Constructs path: /photos/{placeId}/medium.jpg
   */
  mediumSrc = computed(() => `/photos/${this.placeId()}/medium.jpg`);

  /**
   * Computed signal for large image path
   * Constructs path: /photos/{placeId}/large.jpg
   */
  largeSrc = computed(() => `/photos/${this.placeId()}/large.jpg`);

  /**
   * Computed signal for srcset attribute
   * Provides browser with image options: small (576w), medium (768w), large (1280w)
   */
  srcset = computed(() => {
    return `${this.smallSrc()} 576w, ${this.mediumSrc()} 768w, ${this.largeSrc()} 1280w`;
  });

  /**
   * Computed signal for sizes attribute
   * Tells browser how wide the image will be at different viewport widths
   * - Mobile (< 576px): 100% of viewport width
   * - Tablet (576px - 768px): 80% of viewport width
   * - Desktop (> 768px): 50% of viewport width
   */
  sizes = computed(() => {
    return '(max-width: 576px) 100vw, (max-width: 768px) 80vw, 50vw';
  });
}

