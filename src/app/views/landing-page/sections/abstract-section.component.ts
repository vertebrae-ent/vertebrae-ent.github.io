import { WritableSignal, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CMSSection } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';

/**
 * Common functionality for all section components
 */
export abstract class AbstractSectionComponent<T extends CMSSection> {
  service = inject(AppService);
  sec = inject(DomSanitizer);

  _section: WritableSignal<T> = signal({} as T);
  classList = computed(() =>
    [
      'section',
      this._section()?.type,
      ...(this._section().class?.split(' ') ?? []),
    ].join(' '),
  );

  abstract set section(section: CMSSection);
}
