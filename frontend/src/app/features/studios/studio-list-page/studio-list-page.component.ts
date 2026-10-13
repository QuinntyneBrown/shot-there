import { Component, computed, inject, signal } from '@angular/core';
import { StudiosService, StudioSummary } from '@shot-there/api';

import { StudioCardComponent } from '../studio-card/studio-card.component';
import { StudioListState } from './studio-list-state';

@Component({
  selector: 'st-studio-list-page',
  imports: [StudioCardComponent],
  templateUrl: './studio-list-page.component.html',
  styleUrl: './studio-list-page.component.css'
})
export class StudioListPageComponent {
  private readonly studiosService = inject(StudiosService);
  protected readonly state = signal<StudioListState>({ status: 'loading' });
  protected readonly studios = computed<StudioSummary[]>(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.studios : [];
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.state.set({ status: 'loading' });
    this.studiosService.listStudios().subscribe({
      next: (studios) => this.state.set({ status: 'loaded', studios }),
      error: () => this.state.set({ status: 'error' })
    });
  }
}
