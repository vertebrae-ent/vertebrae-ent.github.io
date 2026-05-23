import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { CMSProjectPost, CMSSectionTypeSocial } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { LightboxComponent } from 'src/app/shared/lightbox.component';
import { AppSectionSocialComponent } from '../home/sections/social.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppSectionSocialComponent,
    LightboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProjectsComponent {
  service = inject(AppService);
  route = inject(ActivatedRoute);
  sec = inject(DomSanitizer);
  el = inject(ElementRef);

  observer?: IntersectionObserver;
  /** The currently visible image in the carousel */
  selectedImage = signal<HTMLImageElement | undefined>(undefined);
  /** The image opened in the lightbox */
  openedCarousel = signal<HTMLImageElement | undefined>(undefined);
  /** All the images in the currently focused carousel */
  focusedCarouselImages = computed(() =>
    Array.from(
      this.selectedImage()?.closest('.img-carousel')?.querySelectorAll('img') ??
        [],
    ).filter((i) => !i.classList.contains('btn')),
  );
  /** The index of the currently visible image in the currently focused carousel */
  focusedCarouselImageIndex = computed(() =>
    this.focusedCarouselImages().findIndex(
      (image) => image === this.selectedImage(),
    ),
  );

  /** The lightbox popover dialog */
  popover = viewChild.required<ElementRef<any>>('lightbox');

  // The config for this page
  config = computed(() => this.service.config().projects);
  // The social section
  social = computed(() => {
    return !Array.isArray(this.service.config()?.home)
      ? ({} as CMSSectionTypeSocial)
      : this.service.config().home.filter((s) => s.type === 'social')[0];
  });

  // Fetch the selected project from the route
  selectedRoute = toSignal(this.route.params.pipe(map((p) => p['id'])));
  selected = computed(
    () =>
      this.config() &&
      this.selectedRoute() &&
      this.config().find((project) =>
        project.link.includes(this.selectedRoute()),
      ),
  );

  // Load the timeline posts for the selected project
  timeline = computed(() => {
    const timeline =
      // Contains all the posts initially
      this.selected()?.timeline ||
      // Or posts filtered by the selected project
      this.config().flatMap((project) => project.timeline);
    return timeline.map((t: CMSProjectPost) => {
      // Parse the date from the filename
      const [year, month, day] = t.fileName
        .replace(/^projects\/(.*)\.md$/, '$1')
        .replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3')
        .split('-');
      const publishedDate = new Date(
        parseInt(year.length === 2 ? `20${year}` : year),
        parseInt(month) - 1,
        parseInt(day),
      );
      // Return the date and the content-loader for the post
      return {
        publishedDate,
        date: t.date,
        content: this.service.loadPost(t.fileName),
      };
    });
  });

  constructor() {
    effect(() =>
      this.selectedImage()?.scrollIntoView({
        block: 'nearest',
        inline: 'start',
        behavior: 'smooth',
      }),
    );
    effect(
      () => {
        if (
          this.openedCarousel() != null &&
          this.openedCarousel() !== this.selectedImage()
        ) {
          this.selectedImage.set(this.openedCarousel());
        }
      },
      { allowSignalWrites: true },
    );
  }

  /**
   * Will execute when pointer is over the carousel. This will create and start an
   * intersecion observer which will watch for scroll events in the carousel.
   * The observer will mark the image currently in view as 'visible'
   *
   * @param evt
   */
  watchPost(evt: MouseEvent) {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.selectedImage.set(entry.target as HTMLImageElement);
          }
        });
      },
      {
        root: evt.target as HTMLElement, // use the viewport
        rootMargin: '0px',
        threshold: 0.7, // 70% of the image is visible
      },
    );
    const target = evt.target as HTMLElement;
    Array.from(target.querySelectorAll('img'))
      .filter((i) => !i.classList.contains('btn'))
      .forEach((img) => this.observer!.observe(img as HTMLImageElement));
  }

  /**
   * Will execute when the pointer leaves the carousel. This will stop the observer and
   * cleanup shit.
   *
   * @param evt
   */
  unwatchPost(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    Array.from(target.querySelectorAll('img'))
      .filter((i) => !i.classList.contains('btn'))
      .forEach((img) => this.observer?.unobserve(img as HTMLImageElement));
    delete this.observer; // No longer needed
  }

  /**
   * Listen for click events in the post and react
   * @param evt
   */
  @HostListener('click', ['$event'])
  onClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (target.closest('#lightbox')) return;

    // Get all the images in the post
    let images = this.focusedCarouselImages();
    if (images?.length) {
      const currentIndex = this.focusedCarouselImageIndex();

      if (target.closest('.prev')) {
        // Previous image is clicked. Scroll to the previous image
        if (currentIndex > 0) {
          this.selectedImage.set(images.at(currentIndex - 1));
        }
      } else if (target.closest('.next')) {
        // Next image is clicked. Scroll to the next image
        if (currentIndex < images.length - 1) {
          this.selectedImage.set(images.at(currentIndex + 1));
        }
      } else if (target.closest('img')) {
        // The actual image is clicked. Enlarge the image
        this.openedCarousel.set(evt.target as HTMLImageElement);
      }
    }
  }
}
