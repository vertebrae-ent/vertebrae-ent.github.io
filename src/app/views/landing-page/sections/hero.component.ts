import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, computed } from '@angular/core';
import { CMSSection, CMSSectionTypeHero } from 'src/app/app.model';
import { AbstractSectionComponent } from './abstract-section.component';

/**
 * Renders one section of type hero.
 * A hero section contains a logo, a backdrop image and a list of actions.
 * There should only be one hero section.
 */
@Component({
  selector: 'app-section-hero',
  styles: `
    :host {
      padding-bottom: 0;
    }
    picture {
      display: grid;
      place-content: center;
      place-items: center;
      .logo {
        grid-area: 1 / 1 / -1 / -1;
        width: 50%;
      }
      .backdrop {
        grid-area: 1 / 1 / -1 / -1;
        width: 100%;
      }
      .link-group {
        grid-area: 1 / 1 / -1 / -1;
        display: flex;
        place-content: space-around;
        place-items: center;
        padding-top: 20%;
        gap: 3em;
      }
    }
  `,
  template: `
    <picture>
      <img class="backdrop" [src]="_section().backdropImage" />
      <img class="logo" [src]="_section().logo" />
      <div class="link-group">
        @for (action of _section().actions; track action) {
        <a [href]="action.url" target="_blank" class="button-link">
          {{ action.name }}
        </a>
        }
      </div>
    </picture>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class AppSectionHeroComponent extends AbstractSectionComponent<CMSSectionTypeHero> {
  @HostBinding('class')
  get className() {
    return this.classList();
  }

  @Input() set section(section: CMSSection) {
    // Sanitize section
    const data = structuredClone(section) as CMSSectionTypeHero;
    data.backdropImage = this.sec.bypassSecurityTrustResourceUrl(
      data.backdropImage as string
    );
    data.logo = this.sec.bypassSecurityTrustResourceUrl(data.logo as string);
    data.actions = this.service.toSafeList(data.actions);
    // Set to component state
    this._section.set(data);
  }
}
