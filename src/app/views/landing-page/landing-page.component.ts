import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AppService } from '../../app.service';
import { AppSectionHeroComponent } from './sections/hero.component';
import { AppSectionCarouselComponent } from './sections/carousell.component';
import { AppSectionSocialComponent } from './sections/social.component';
import { AppSectionTextComponent } from './sections/text.component';

/**
 * Renders the main landing page.
 */
@Component({
  selector: 'app-main',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AppSectionHeroComponent,
    AppSectionCarouselComponent,
    AppSectionSocialComponent,
    AppSectionTextComponent,
  ],
})
export class AppMainComponent {
  service = inject(AppService);

  sections = computed(() => this.service.config().sections);

  links = computed(() =>
    this.service.toSafeList(this.service.config().linkList)
  );
}
