import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { CMSSectionTypeSocial } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AppSectionSocialComponent } from '../home/sections/social.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, AppSectionSocialComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProjectsComponent {
  service = inject(AppService);
  route = inject(ActivatedRoute);
  sec = inject(DomSanitizer);
  el = inject(ElementRef);

  observer?: IntersectionObserver;
  selectedImage = signal<HTMLImageElement | undefined>(undefined);
  currentCarousel = signal<HTMLElement | undefined>(undefined);

  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('largeImage');

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
      this.selectedRoute() &&
      this.config() &&
      this.config().find((project) =>
        project.link.includes(this.selectedRoute()),
      ),
  );

  // Load the timeline posts for the selected project
  timeline = computed(() => {
    return (
      this.selected() &&
      this.selected().timeline.map((t: string) => {
        // Parse the date from the filename
        const [year, month, day] = t
          .replace(/^projects\/(.*)\.md$/, '$1')
          .replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3')
          .split('-');
        const date = new Date(
          parseInt(year.length === 2 ? `20${year}` : year),
          parseInt(month) - 1,
          parseInt(day),
        );
        // Return the date and the content-loader for the post
        return {
          date,
          content: this.service.loadPost(t),
        };
      })
    );
  });

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
            entry.target.classList.add('visible');
            this.selectedImage.set(entry.target as HTMLImageElement);
          } else {
            entry.target.classList.remove('visible');
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
    this.currentCarousel.set(target);
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
    this.currentCarousel.set(undefined);
  }

  /**
   * Listen for click events in the post and react
   * @param evt
   */
  @HostListener('click', ['$event'])
  onClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    // Get all the images in the post
    let imgNodes = target.closest('.img-carousel')?.querySelectorAll('img');
    if (imgNodes?.length) {
      const images = Array.from(imgNodes).filter(
        (i) => !i.classList.contains('btn'),
      );
      const currentIndex = images.findIndex((img) =>
        img.classList.contains('visible'),
      );

      if (target.closest('.prev')) {
        // Previous image is clicked. Scroll to the previous image
        if (currentIndex > 0) {
          this.selectedImage.set(images.at(currentIndex - 1));
          this.selectedImage()?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (target.closest('.next')) {
        // Next image is clicked. Scroll to the next image
        if (currentIndex < images.length - 1) {
          this.selectedImage.set(images.at(currentIndex + 1));
          this.selectedImage()?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (target.closest('img')) {
        // The actual image is clicked. Enlarge the image
        this.showImage(evt);
      }
    }
  }

  showImage(evt: MouseEvent) {
    setTimeout(() => {
      const closeModal = () => {
        this.dialog().nativeElement.close();
        document.removeEventListener('click', closeModal);
      };
      document.addEventListener('click', closeModal);
    });
    this.dialog().nativeElement.showModal();
  }
}
