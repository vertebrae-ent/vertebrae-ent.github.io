import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, computed } from '@angular/core';
import { CMSLinks, CMSSection, CMSSectionTypeSocial } from 'src/app/app.model';
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
      .links {
        flex-wrap: no-wrap;
      }
      li {
        background-image: url('/assets/asset_knuckle.svg');
        background-repeat: no-repeat;
        background-size: 110%;
        background-position: -0.2em 0.2em;
        width: var(--knuckle-size);
        height: var(--knuckle-size);
        padding: 2vw;
        display: flex;
        place-content: center;
        place-items: center;
        flex: 1;
        transition-property: all;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
        aspect-ratio: 0.9;
        @media screen and (min-width: 1024px) {
          padding: 1.6rem;
        }
        &:has(a):hover {
          filter: invert(1);
          background-size: 100%;
          background-position: 0 0.5em;
          scale: 1.12;
        }
        a {
          width: 100%;
          height: 100%;
          display: flex;
          place-content: center;
          place-items: center;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  `,
  template: `
    <header [class]="_section().headerPosition">
      <h2>{{ _section().header }}</h2>
    </header>
    <div>
      <ul class="links">
        <li></li>
        <li></li>
        @for (link of _section().links; track link) {
        <li>
          @if (link.url != null) {
          <a [href]="link.url" target="_blank">
            <img [src]="link.image" />
          </a>
          } @else if (link.action != null) {
          <a (click)="runAction(link)">
            <img [src]="link.image" />
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
  imports: [CommonModule],
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
