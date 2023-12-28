import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from './app.service';
import { AppLinkListComponent } from './shared/link-list.component';

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
  imports: [CommonModule, RouterModule, HttpClientModule, AppLinkListComponent],
  providers: [AppService],
})
export class AppComponent implements OnInit {
  service = inject(AppService);

  @HostBinding('class') className = 'app-root';

  @ViewChild('nagModal') modal!: ElementRef<HTMLDialogElement>;
  userRequestedNag = signal(false);

  /**
   * Component initializer.
   */
  ngOnInit(): void {
    this.service.showNewsLetterDialog$.subscribe((val) =>
      this.openNagDialog(undefined, true),
    );
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
      return true;
    }
    return false;
  }

  /**
   * Close the newsletter nag dialog.
   *
   * @param $event
   */
  closeNagDialog($event: Event) {
    localStorage.setItem('newsNagDone', 'true');
    this.modal.nativeElement.close();
    console.log('Canceled!');
  }
}
