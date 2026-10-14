import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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
import { MediaFallbackComponent } from '../responsive-image/media-fallback.component';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image.component';
import { ResponsiveImage } from '../types/responsive-image';

/**
 * An episode poster: a link to the episode on YouTube (so it works without JavaScript) that, on an
 * unmodified click or Enter, is replaced by the youtube-nocookie player, which takes focus (L2-047).
 * A missing or failed still shows the episode title on the poster instead (CRD video-poster D-1, D-2).
 */
@Component({
  selector: 'st-video-poster',
  imports: [IconComponent, MediaFallbackComponent, ResponsiveImageComponent],
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
  protected readonly failed = signal(false);
  /** The link's name, set in full because Chrome adds a space before a visually hidden span. */
  protected readonly accessibleName = computed(() => this.playLabel() + (this.playContext() ?? ''));

  constructor() {
    // st-responsive-image catches every failure of the still (an error event, one replayed from before
    // hydration, or one found after it) and shows its own fallback. The poster watches for that
    // fallback and swaps in its own, which shows the episode title (CRD video-poster D-2).
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const stillFailed = () => !!host.querySelector('.video-poster > :not(.media-fallback) .media-fallback');
      if (stillFailed()) {
        this.failed.set(true);
        return;
      }
      const observer = new MutationObserver(() => {
        if (stillFailed()) {
          this.failed.set(true);
          observer.disconnect();
        }
      });
      observer.observe(host, { childList: true, subtree: true });
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected play(event: MouseEvent): void {
    // Modified and middle clicks fall through to the link, so "open in a new tab" keeps working (D-3).
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
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
