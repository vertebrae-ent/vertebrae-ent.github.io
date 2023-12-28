import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
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
      div {
        position: relative;
        z-index: 2;
        min-height: 13em;
        outline-color: var(--section-background-color);
        outline-width: 2px;
        outline-style: solid;
        display: flex;
        flex-wrap: nowrap;
        place-content: center;
        overflow-x: auto;
        > a  {
          display: contents;
        }
        picture {
          position: relative;
          display: flex;
          place-items: center;
          outline: 2px solid var(--section-background-color);
          > img {
            max-width: 18em;
            width: 100%;
            object-fit: cover;
          }
        }
      }
    `,
  template: `
    <header [class]="_section().headerPosition">
      <h2>{{ _section().header }}</h2>
    </header>
    <div>
      @for (img of _section().images; track img.url) {
        @if (img.link) {
          <a [routerLink]="img.link" [attr.aria-label]="img.header || img.text">
            <ng-container
              *ngTemplateOutlet="picture; context: { $implicit: img }"
            ></ng-container>
          </a>
        } @else {
          <ng-container
            *ngTemplateOutlet="picture; context: { $implicit: img }"
          ></ng-container>
        }
      }
    </div>
    <ng-template #picture let-img>
      <picture>
        <img [src]="img.url" [alt]="img.text" />
      </picture>
    </ng-template>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
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
