import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriberService } from '@shot-there/api';
import { AlertComponent, ButtonComponent, TextFieldComponent } from '@shot-there/components';

import { toSignupState, validateEmail } from './signup-form';
import { SignupState } from './signup-state';

/** The email signup form (L2-039, L2-041), placed in the site footer and on the home page. */
@Component({
  selector: 'st-email-signup',
  imports: [FormsModule, TextFieldComponent, ButtonComponent, AlertComponent],
  templateUrl: './email-signup.component.html',
  styleUrl: './email-signup.component.css',
})
export class EmailSignupComponent {
  /** The hero form on the home page has its own copy and a primary button. */
  readonly variant = input.required<'hero' | 'footer'>();

  private readonly subscriberService = inject(SubscriberService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  protected readonly state = signal<SignupState>('idle');
  protected readonly email = signal('');
  protected readonly website = signal('');
  protected readonly error = signal<string | null>(null);
  protected readonly standaloneNgModel = { standalone: true };
  protected readonly ids = computed(() => ({
    title: `${this.variant()}-signup-title`,
    email: `${this.variant()}-email`,
    website: `${this.variant()}-website`,
  }));

  submit(): void {
    const error = validateEmail(this.email());
    this.error.set(error);
    if (error) {
      this.state.set('invalid');
      this.document.getElementById(this.ids().email)?.focus();
      return;
    }
    const sourcePath = this.router.url.split(/[?#]/)[0];
    this.state.set('submitting');
    this.subscriberService
      .subscribe({ email: this.email().trim(), sourcePath, website: this.website() })
      .subscribe({
        next: () => this.state.set(toSignupState(200)),
        error: (response: HttpErrorResponse) => this.state.set(toSignupState(response.status)),
      });
  }
}
