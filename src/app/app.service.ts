import { HttpClient } from '@angular/common/http';
import {
  EventEmitter,
  Injectable,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CMSConfig, CMSLinks } from './app.model';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * The main application service will read in the configuration,
 * validate it and provide functionality for sanitizing the data.
 */
@Injectable()
export class AppService {
  config: WritableSignal<CMSConfig> = signal({} as CMSConfig);
  sec = inject(DomSanitizer);
  showNewsLetterDialog$: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) {
    // It will read the `./index.json` file when the service is created
    // and make the configuration available via the `config` property.
    firstValueFrom(this.http.get<CMSConfig>('/index.json')).then((config) =>
      this.config.set(config)
    );
  }

  /**
   * Utility function for sanitizing the urls provided in the configuration.
   *
   * @param data an array of `CMSLinks` objects
   * @returns The data object where all string url's are replaced with
   *          `SafeUrl` or `SafeResourceUrl` objects.
   */
  toSafeList(data: CMSLinks[]) {
    const list = structuredClone(data);
    return (
      list?.map((l) => {
        if (l.image && typeof l.image === 'string') {
          l.image = this.sec.bypassSecurityTrustResourceUrl(l.image);
        }
        if (l.url && typeof l.url === 'string') {
          l.url = this.sec.bypassSecurityTrustUrl(l.url);
        }
        if (l.action) {
          switch (l.action) {
            case 'newsletter':
              l.safeAction = this.showNewsLetterDialog.bind(this);
              break;
          }
        }
        return l;
      }) ?? []
    );
  }

  /**
   * Responsible for showing the newsletter dialog.
   * This dialog will display when user blurs the window, tries to close the
   * tab or clicks the newsletter button in the footer.
   *
   * We will only show the dialog once for page unloads or window blurs,
   * so we store a flag in `localStorage` to indicate that the user has already
   * seen the dialog. This flag will be removed if the user explicitly clicks the newsletter
   * icon in the footer, in order to show the dialog again.
   */
  showNewsLetterDialog() {
    localStorage.removeItem('newsNagDone');
    this.showNewsLetterDialog$.emit('user-requested');
  }
}
