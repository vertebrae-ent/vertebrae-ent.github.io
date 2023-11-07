import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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
        <a [href]="link.url" target="_blank">{{ link.name }}</a>
      </li>
      <ng-content></ng-content>
      <li *ngFor="let link of right()">
        <a [href]="link.url" target="_blank">{{ link.name }}</a>
      </li>
    </ul>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class AppLinkListComponent {
  service = inject(AppService);
  links = computed(() =>
    this.service.toSafeList(this.service.config().linkList)
  );
  left = computed(() =>
    this.links().slice(0, Math.floor(this.links().length / 2))
  );
  right = computed(() =>
    this.links().slice(Math.ceil(this.links().length / 2))
  );
}
