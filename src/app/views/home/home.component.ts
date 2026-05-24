
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AppService } from '../../app.service';
import { AppSectionCarouselComponent } from './sections/carousell.component';
import { AppSectionHeroComponent } from './sections/hero.component';
import { AppSectionSocialComponent } from './sections/social.component';
import { AppSectionTextComponent } from './sections/text.component';

/**
 * Renders the main landing page.
 */
@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    imports: [
    AppSectionHeroComponent,
    AppSectionCarouselComponent,
    AppSectionSocialComponent,
    AppSectionTextComponent
],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHomeComponent {
  service = inject(AppService);

  sections = computed(() => this.service.config().home);

  links = computed(() =>
    this.service.toSafeList(this.service.config().linkList),
  );
}
