import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Injector,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image.component';
import { ResponsiveImage } from '../types/responsive-image';

/**
 * An episode poster: a link to the episode on YouTube (so it works without JavaScript) that, once
 * activated, is replaced by the youtube-nocookie player, which takes focus (L2-047).
 */
@Component({
  selector: 'st-video-poster',
  imports: [IconComponent, ResponsiveImageComponent],
  templateUrl: './video-poster.component.html',
  styleUrl: './video-poster.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPosterComponent {
  readonly poster = input<ResponsiveImage | null>(null);
  readonly watchUrl = input.required<string>();
  readonly embedUrl = input.required<SafeResourceUrl>();
  readonly title = input.required<string>();
  readonly playLabel = input($localize`:@@st.video.play:Play episode`);
  readonly playContext = input<string | null>(null);
  readonly played = output<void>();

  private readonly injector = inject(Injector);
  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');
  protected readonly playing = signal(false);
  /** The link's name, set in full because Chrome adds a space before a visually hidden span. */
  protected readonly accessibleName = computed(() => this.playLabel() + (this.playContext() ?? ''));

  protected play(event: Event): void {
    event.preventDefault();
    this.playing.set(true);
    afterNextRender(
      () => {
        this.frame()?.nativeElement.focus();
        this.played.emit();
      },
      { injector: this.injector },
    );
  }
}
