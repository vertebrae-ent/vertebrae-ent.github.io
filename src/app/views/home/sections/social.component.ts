import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { CMSLinks, CMSSection, CMSSectionTypeSocial } from 'src/app/app.model';
import { AppTooltipDirective } from 'src/app/shared/tooltip.directive';
import { AbstractSectionComponent } from './abstract-section.component';

/**
 * Renders one section of type social.
 * A social section contains a list of links to social media.
 */
@Component({
  selector: 'app-section-social',
  styles: `
    :host {
      --color: var(--accent-color);
      --knuckle-size: 11.1%;
      background-color: var(--color);
      display: block;
      padding-bottom: 1rem;
      div {
        position: relative;
        z-index: 2;
      }
    }
  `,
  template: `
    <header [class]="_section().headerPosition">
      <h2>{{ _section().header }}</h2>
    </header>
    <div>
      <ul class="knuckles links">
        <li></li>
        <li></li>
        @for (link of _section().links; track link) {
          <li [tooltip]="link.description">
            @if (link.url != null) {
              <a
                [href]="link.url"
                target="_blank"
                [attr.aria-label]="link.name"
              >
                <img [src]="link.image" [alt]="link.name" />
              </a>
            } @else if (link.action != null) {
              <a (click)="runAction(link)" [attr.aria-label]="link.name">
                <img [src]="link.image" [alt]="link.name" />
              </a>
            }
          </li>
        }
        <li></li>
        <li></li>
      </ul>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, AppTooltipDirective],
})
export class AppSectionSocialComponent extends AbstractSectionComponent<CMSSectionTypeSocial> {
  @HostBinding('class')
  get className() {
    return this.classList();
  }

  @Input() set section(section: CMSSection) {
    // Sanitize section
    const data = structuredClone(section) as CMSSectionTypeSocial;
    data.links = this.service.toSafeList(data.links);

    // Set to component state
    this._section.set(data);
  }

  runAction(link: CMSLinks) {
    try {
      link.safeAction();
    } catch (ex) {
      console.log(ex);
    }
  }
}
