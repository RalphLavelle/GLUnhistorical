import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TouristService } from '../../services/bookings';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-book-tour',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './book-tour.html',
  styleUrl: './book-tour.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookTour {
  // Inject services
  private touristService = inject(TouristService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Signal to track form submission state
  isSubmitting = signal(false);
  
  // Signal to track success state
  showSuccess = signal(false);
  
  // Signal to track if form should be hidden
  hideForm = signal(false);

  // Minimum date for date picker (today's date)
  minDate: string;

  // Reactive form for booking
  bookingForm: FormGroup;

  constructor() {
    // Set minimum date for date picker (today's date)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;

    // Initialize the reactive form with validators
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      partySize: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      preferredDate: ['', [Validators.required]]
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Set submitting state
    this.isSubmitting.set(true);

    // Prepare booking data
    const bookingData: Booking = {
      name: this.bookingForm.value.name,
      email: this.bookingForm.value.email,
      partySize: this.bookingForm.value.partySize,
      preferredDate: this.bookingForm.value.preferredDate
    };

    // Submit booking to backend
    this.touristService.submitBooking(bookingData).subscribe({
      next: () => {
        // Success - show thank you message
        this.showSuccess.set(true);
        this.hideForm.set(true);
        this.isSubmitting.set(false);

        // Hide success message and restore form after 5 seconds
        setTimeout(() => {
          this.showSuccess.set(false);
          this.hideForm.set(false);
          // Reset form for potential new booking
          this.bookingForm.reset({
            partySize: 1
          });
        }, 5000);
      },
      error: (error) => {
        console.error('Error submitting booking:', error);
        this.isSubmitting.set(false);
        // In a real app, you'd show an error message to the user
        alert('There was an error submitting your booking. Please try again.');
      }
    });
  }

  /**
   * Navigate to places page
   */
  goToPlaces(): void {
    this.router.navigate(['/places']);
  }

  /**
   * Get form control for easier access in template
   */
  getFormControl(name: string) {
    return this.bookingForm.get(name);
  }

  /**
   * Check if a form field has an error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.getFormControl(fieldName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

}

