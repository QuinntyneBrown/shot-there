import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'st-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrl: './skip-link.component.css',
})
export class SkipLinkComponent {
  private readonly document = inject(DOCUMENT);

  skipToMain(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main')?.focus();
  }
}
