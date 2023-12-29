import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CMSLinks, CMSSectionTypeSocial } from './app.model';
import { AppService } from './app.service';
import { AppLinkListComponent } from './shared/link-list.component';
import { AppTooltipDirective } from './shared/tooltip.directive';

/**
 * The main application component.
 * This is responsible for rendering the basic layout of the app.
 * It is the root component, bootstrapped in `src/main.ts`, and
 * holds the router-outlet for all other routes in the app.
 *
 * It also provides the `AppService` as a provider, so that all
 * components in the app can inject it.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AppLinkListComponent,
    AppTooltipDirective,
  ],
  providers: [AppService],
})
export class AppComponent implements OnInit {
  service = inject(AppService);

  @HostBinding('class') className = 'app-root';

  @ViewChild('nagModal') modal!: ElementRef<HTMLDialogElement>;
  userRequestedNag = signal(false);

  openedAt = -1;
  social = computed(() => {
    if (!Array.isArray(this.service.config()?.home)) {
      return {} as CMSSectionTypeSocial;
    }
    const config = structuredClone(
      this.service
        .config()
        .home.filter((s) => s.type === 'social')[0] as CMSSectionTypeSocial,
    );
    config.links = this.service.toSafeList(config.links);
    return config;
  });

  /**
   * Component initializer.
   */
  ngOnInit(): void {
    this.service.showNewsLetterDialog$.subscribe((val) =>
      this.openNagDialog(undefined, true),
    );
  }

  runAction(link: CMSLinks) {
    try {
      link.safeAction();
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * Close the dialog if the user clicks outside of it.
   * @param event
   */
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const now = performance.now(); // Must check the time, because the click event is fired before the dialog is opened
    if (this.modal.nativeElement.open && now - this.openedAt > 100) {
      var rect = this.modal.nativeElement.getBoundingClientRect();
      var isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        this.closeNagDialog();
      }
    }
  }

  /**
   * Show the newsletter nag dialog.
   *
   * @param event an optional `visibilitychange` event, if the user is blurs the page
   * @param requested if `true`, the user has explicitly requested the dialog
   * @returns
   */
  // @HostListener('window:beforeunload', ['$event'])
  @HostListener('document:visibilitychange', ['$event'])
  openNagDialog(event?: Event, requested = false) {
    this.userRequestedNag.set(requested);
    if (localStorage.getItem('newsNagDone') == null) {
      // User has not accepted nor rejected the newsletter thingy
      // Show nag-dialog
      if (event != null) event.preventDefault();
      this.modal.nativeElement.showModal();
      this.openedAt = performance.now();
      return true;
    }
    return false;
  }

  /**
   * Close the newsletter nag dialog.
   */
  closeNagDialog() {
    localStorage.setItem('newsNagDone', 'true');
    this.modal.nativeElement.close();
    console.log('Canceled!');
  }
}
