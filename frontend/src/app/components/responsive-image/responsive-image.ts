import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/**
 * ResponsiveImageComponent
 * 
 * A reusable component for displaying responsive images from Cloudinary CDN.
 * Uses NgOptimizedImage with the Cloudinary loader for automatic optimization
 * and responsive image delivery.
 */
@Component({
  selector: 'app-responsive-image',
  imports: [NgOptimizedImage],
  templateUrl: './responsive-image.html',
  styleUrl: './responsive-image.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsiveImageComponent {
  // Required input: the place ID - corresponds to the image public_id in Cloudinary
  placeId = input.required<string>();
  
  // Required input: alt text for accessibility
  altText = input.required<string>();

  /**
   * Responsive width descriptors for srcset
   * Matches the 3-tier breakpoint system from styles.less:
   * - 576w: Small devices (mobile) - @breakpoint-sm
   * - 768w: Medium devices (tablet) - @breakpoint-md
   * - 1280w: Large devices (desktop) - @breakpoint-lg
   */
  readonly responsiveWidths = '576w, 768w, 1280w';

  /**
   * Sizes attribute for responsive images
   * Matches the 3-tier breakpoint system from styles.less:
   * - Mobile (< 576px / @breakpoint-sm): 100% of viewport width
   * - Tablet (576px - 768px / @breakpoint-md): 80% of viewport width  
   * - Desktop (> 768px): 50% of viewport width
   */
  readonly imageSizes = '(max-width: 576px) 100vw, (max-width: 768px) 80vw, 50vw';
}
