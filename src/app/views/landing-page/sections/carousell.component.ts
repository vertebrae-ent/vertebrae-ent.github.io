import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, computed } from '@angular/core';
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
      /* :host,
      :host::before,
      :host::after {
        background-image: url('/assets/asset_fossilwall.svg');
        background-attachment: fixed;
        background-size: 22rem;
      } */
      div {
        position: relative;
        z-index: 2;
        min-height: 13em;
        border-color: var(--section-background-color);
        border-width: 1px 0 1px 0;
        border-style: solid;
      }
    `,
  template: `
    <header [class]="_section().headerPosition">
      <h2>{{ _section().header }}</h2>
    </header>
    <div></div>
  `,
  standalone: true,
  imports: [CommonModule],
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
