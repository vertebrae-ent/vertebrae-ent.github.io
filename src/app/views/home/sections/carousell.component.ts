import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CMSSection, CMSSectionTypeCarousel } from 'src/app/app.model';
import { AbstractSectionComponent } from './abstract-section.component';

/**
 * Renders one section of type carousel.
 * A carousel section contains a list of images which can
 * be scrolled through, or if no user-interaction is happening,
 * the images will be scrolled automatically.
 */
@Component({
  selector: 'app-section-carousel',
  styles: `
    :host {
      --color: var(--body-background-color);
      display: block;
    }
  `,
  template: `
    @if (_section().header) {
      <header [class]="_section().headerPosition">
        <h2>{{ _section().header }}</h2>
      </header>
    }
    <div class="tabs">
      @for (img of _section().images; track img.url) {
        @if (img.link) {
          <a [routerLink]="img.link" [attr.aria-label]="img.header || img.text">
            <picture><img [src]="img.url" [alt]="img.text" /></picture>
          </a>
        } @else {
          <picture><img [src]="img.url" [alt]="img.text" /></picture>
        }
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSectionCarouselComponent extends AbstractSectionComponent<CMSSectionTypeCarousel> {
  @HostBinding('class')
  get className() {
    return this.classList();
  }

  @Input() set section(section: CMSSection) {
    // Sanitize section
    const data = structuredClone(section) as CMSSectionTypeCarousel;
    // Set to component state
    this._section.set(data);
  }
}
