import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriberService } from '@shot-there/api';

import { toSignupState, validateEmail } from './signup-form';
import { SignupState } from './signup-state';

/** The email signup form (L2-039, L2-041), placed in the site footer and on the home page. */
@Component({
  selector: 'st-email-signup',
  templateUrl: './email-signup.component.html',
  styleUrl: './email-signup.component.css'
})
export class EmailSignupComponent {
  /** The hero form on the home page has its own copy and a primary button. */
  readonly variant = input.required<'hero' | 'footer'>();

  private readonly subscriberService = inject(SubscriberService);
  private readonly router = inject(Router);

  protected readonly state = signal<SignupState>('idle');
  protected readonly email = signal('');
  protected readonly website = signal('');
  protected readonly error = signal<string | null>(null);
  private readonly emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');
  protected readonly ids = computed(() => ({
    title: `${this.variant()}-signup-title`,
    email: `${this.variant()}-email`,
    error: `${this.variant()}-email-error`,
    website: `${this.variant()}-website`
  }));

  submit(): void {
    const error = validateEmail(this.email());
    this.error.set(error);
    if (error) {
      this.state.set('invalid');
      this.emailInput()?.nativeElement.focus();
      return;
    }
    const sourcePath = this.router.url.split(/[?#]/)[0];
    this.state.set('submitting');
    this.subscriberService.subscribe({ email: this.email().trim(), sourcePath, website: this.website() }).subscribe({
      next: () => this.state.set(toSignupState(200)),
      error: (response: HttpErrorResponse) => this.state.set(toSignupState(response.status))
    });
  }
}
