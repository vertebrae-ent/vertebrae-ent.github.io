import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CMSSection, CMSSectionTypeText } from 'src/app/app.model';
import { AbstractSectionComponent } from './abstract-section.component';

/**
 * Renders one section of type text.
 * A text section contains a header, a text and an optional image.
 */
@Component({
  selector: 'app-section-text',
  styles: `
    :host {
      --color: var(--grey-color);
      display: block;
      background-color: var(--color);
      @media screen and (max-width: 640px) {
        &.toothrack:has(img) {
          padding-bottom: 3em;
        }
      }
    }
    .content {
      display: grid;
      grid-template-columns: 1fr 19em;
      > div {
        padding: 0 var(--text-margin);
        position: relative;
        white-space: pre-line;
        background: var(--body-text-color);
        flex: 1;
        position: relative;
        z-index: 2;
        p {
          margin: var(--text-margin) 0 0 0;
        }
        .actions {
          text-align: right;
          margin-bottom: var(--text-margin);
        }
      }
      img {
        margin-right: var(--text-margin);
        transform: translateX(-2px);
        min-height: 100%;
      }
      @media screen and (max-width: 640px) {
        grid-template-columns: 1fr;
        img {
          max-height: 10em;
          transform: translateX(var(--text-margin));
        }
      }
    }
  `,
  template: `
    <header [class]="_section().headerPosition">
      <h2>{{ _section().header }}</h2>
    </header>
    <div class="content">
      @if (_section().image != null && _section().image.position === 'before') {
        <img
          [src]="_section().image.url"
          [alt]="_section().image.header || _section().image.text"
          height="130"
        />
      }
      <div>
        <p>{{ _section().text }}</p>
        <div class="actions">
          @for (action of _section().actions; track action.url) {
            <a
              [routerLink]="[action.url]"
              [target]="action.target"
              class="button-link"
              >{{ action.name }}</a
            >
          }
        </div>
      </div>
      @if (_section().image != null && _section().image.position === 'after') {
        <img
          [src]="_section().image.url"
          [alt]="_section().image.header || _section().image.text"
          height="130"
        />
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AppSectionTextComponent extends AbstractSectionComponent<CMSSectionTypeText> {
  @HostBinding('class')
  get className() {
    return this.classList();
  }

  @Input() set section(section: CMSSection) {
    // Sanitize section
    const data = structuredClone(section) as CMSSectionTypeText;
    if (data.image) {
      data.image.url = this.sec.bypassSecurityTrustResourceUrl(
        data.image.url as string,
      );
    }
    // Set to component state
    this._section.set(data);
  }
}
