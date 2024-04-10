import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
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
        height: auto;
      }
      .backdrop {
        grid-area: 1 / 1 / -1 / -1;
        width: 100%;
        height: auto;
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
      <img
        class="backdrop"
        [ngSrc]="_section().backdropImage"
        width="1024"
        height="576"
        [priority]="true"
        alt="Hero backdrop image"
      />
      <img
        class="logo"
        [ngSrc]="_section().logo"
        width="512"
        height="307"
        alt="Project logo"
      />
      <div class="link-group">
        @for (action of _section().actions; track action) {
          <ng-container
            *ngTemplateOutlet="anchor; context: { $implicit: action }"
          ></ng-container>
        }
      </div>
    </picture>

    <ng-template #anchor let-link>
      @if (link.isInternal) {
        <a
          [routerLink]="[link.url]"
          [target]="link.target"
          class="button-link"
          >{{ link.name }}</a
        >
      } @else {
        <a [href]="link.url" [target]="link.target" class="button-link">{{
          link.name
        }}</a>
      }
    </ng-template>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
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
      data.backdropImage as string,
    );
    data.logo = this.sec.bypassSecurityTrustResourceUrl(data.logo as string);
    data.actions = this.service.toSafeList(data.actions);
    // Set to component state
    this._section.set(data);
  }
}
