import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  model,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog
      id="lightbox"
      class="img-carousel"
      #popover
      (click)="toggle($event)"
    >
      <span class="prev" (click)="previous()" [attr.disabled]="!canPrevious()">
        <img class="btn" src="/assets/icons/back.svg" alt="Previous image" />
      </span>
      <figure class="image" [innerHTML]="imageHTML()"></figure>
      <span class="next" (click)="next()" [attr.disabled]="!canNext()">
        <img class="btn" src="/assets/icons/next.svg" alt="Next image" />
      </span>
    </dialog>
  `,
  styles: `
    :host {
      #lightbox {
        --article-background-color: var(--body-background-color);
        --carousel-button-gradient-width: 50%;
        --carousel-margin: 5em;
        position: fixed;
        border: 0;
        transform: scale(0.8);
        height: max-content;
        width: max-content;
        background: var(--body-background-color);

        .prev,
        .next {
          place-content: center;
          transition-duration: 200ms;
          transition-timing-function: ease-in;
          img {
            transition-property: filter -webkit-filter -moz-filter -ms-filter -o-filter;
            filter: invert(1);
          }
          &[disabled='true'] > img {
            filter: invert(0.4);
          }
        }
        .prev {
          left: 0;
        }
        .next {
          right: 0;
        }
        .image ::ng-deep img {
          width: clamp(
            calc(1024px - (var(--carousel-margin) * 2)),
            100vw,
            80vw
          );
          @media screen and (max-width: 1024px) {
            width: calc(100vw - (var(--carousel-margin) * 2));
          }
        }
        &,
        &::backdrop {
          transition:
            display 200ms allow-discrete,
            overlay 200ms allow-discrete,
            transform 200ms,
            opacity 200ms;
          opacity: 0;
          background-image: radial-gradient(
            color-mix(in srgb, var(--body-text-color), transparent 80%),
            color-mix(in srgb, var(--body-background-color), transparent 10%)
              55%
          );
        }
        &[open] {
          box-shadow: 0 0 6rem var(--grey-color);
          place-content: center;
          opacity: 1;
          transform: scale(1);
          display: flex;
          &::backdrop {
            opacity: 1;
          }
        }

        @starting-style {
          &[open],
          &[open]::backdrop {
            opacity: 0;
          }
        }
      }
    }
  `,
})
export class LightboxComponent {
  sanitize = inject(DomSanitizer);
  element = viewChild<ElementRef>('popover');

  openedImage = model<HTMLImageElement | undefined>();
  carouselContainer = computed(() =>
    this.openedImage()?.closest('.img-carousel'),
  );
  images = computed(() => {
    return Array.from(
      this.carouselContainer()?.querySelectorAll('img') ?? [],
    )?.filter((i) => !i.classList.contains('btn')) as HTMLImageElement[];
  });
  currentIndex = computed(() =>
    this.images().findIndex((i) => i === this.openedImage()),
  );
  imageHTML = computed(() =>
    this.sanitize.bypassSecurityTrustHtml(this.openedImage()?.outerHTML ?? ''),
  );
  canPrevious = computed(() => this.currentIndex() > 0);
  canNext = computed(() => this.currentIndex() < this.images().length - 1);

  constructor() {
    effect(() => {
      if (this.openedImage() != null) {
        const popoverElement = this.element()?.nativeElement;
        popoverElement.showModal();
      }
    });
  }

  @HostListener('window:keydown.ArrowLeft')
  previous() {
    if (this.canPrevious()) {
      this.openedImage.set(this.images()[this.currentIndex() - 1]);
    }
  }
  @HostListener('window:keydown.ArrowRight')
  next() {
    if (this.canNext()) {
      this.openedImage.set(this.images()[this.currentIndex() + 1]);
    }
  }

  toggle(evt: MouseEvent) {
    const dialog = this.element()?.nativeElement;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= evt.clientY &&
      evt.clientY <= rect.top + rect.height &&
      rect.left <= evt.clientX &&
      evt.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      dialog.close();
      setTimeout(() => this.openedImage.set(undefined), 500);
    }
  }
}
