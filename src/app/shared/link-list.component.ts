import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-linklist',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ul class="links">
      <li *ngFor="let link of left()">
        <ng-container
          *ngTemplateOutlet="anchor; context: { $implicit: link }"
        ></ng-container>
      </li>
      <ng-content></ng-content>
      <li *ngFor="let link of right()">
        <ng-container
          *ngTemplateOutlet="anchor; context: { $implicit: link }"
        ></ng-container>
      </li>
    </ul>

    <ng-template #anchor let-link>
      @if (link.isInternal) {
        <a
          [routerLink]="[link.url]"
          [target]="link.target"
          [attr.aria-label]="link.name"
          >{{ link.name }}</a
        >
      } @else {
        <a
          [href]="link.url"
          [target]="link.target"
          [attr.aria-label]="link.name"
          >{{ link.name }}</a
        >
      }
    </ng-template>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AppLinkListComponent {
  service = inject(AppService);

  links = computed(() =>
    this.service.toSafeList(this.service.config().linkList),
  );
  left = computed(() =>
    this.links().slice(0, Math.floor(this.links().length / 2)),
  );
  right = computed(() =>
    this.links().slice(Math.ceil(this.links().length / 2)),
  );
}
