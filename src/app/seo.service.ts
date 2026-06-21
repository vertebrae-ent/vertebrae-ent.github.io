import { Injectable, Injector, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AppService } from './app.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly appService = inject(AppService);
  private readonly injector = inject(Injector);

  private readonly siteName = 'Vertebrae Entertainment';
  private readonly slogan = 'Games made with pride and attitude';
  private readonly siteOrigin = 'https://vertebrae.rip';
  private readonly defaultImage = '/assets/logo_spinecoil.svg';
  private readonly currentPath = signal('/');

  private started = false;

  init() {
    if (this.started) {
      return;
    }
    this.started = true;

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        map(() => this.normalizePath(this.router.url)),
      )
      .subscribe((path) => this.currentPath.set(path));

    effect(
      () => {
        this.appService.config();
        this.applyForPath(this.currentPath());
      },
      { injector: this.injector },
    );
  }

  private applyForPath(path: string) {
    const config = this.appService.config();

    if (path === '/') {
      this.setMeta({
        title: this.siteName,
        description: config?.home?.['og:description']?.trim() || this.slogan,
        image: this.defaultImage,
        url: '/',
      });
      return;
    }

    if (path === '/about') {
      this.setMeta({
        title: this.buildTitle(config?.about?.['og:title']),
        description: config?.about?.['og:description']?.trim() || this.slogan,
        image: this.defaultImage,
        url: path,
      });
      return;
    }

    if (path === '/projects') {
      this.setMeta({
        title: this.buildTitle(config?.projects?.['og:title']),
        description:
          config?.projects?.['og:description']?.trim() || this.slogan,
        image: this.defaultImage,
        url: path,
      });
      return;
    }

    const projectMatch = path.match(/^\/projects\/([^/]+)$/);
    if (projectMatch?.[1]) {
      const id = projectMatch[1];
      const project = config?.projects?.content?.find(
        (entry) => this.normalizePath(entry.link) === `/projects/${id}`,
      );

      if (project) {
        this.setMeta({
          title: this.buildTitle(project['og:title']),
          description:
            project['og:description']?.trim() ||
            `${project.header} by ${this.siteName}.`,
          image:
            typeof project.url === 'string' ? project.url : this.defaultImage,
          url: path,
        });
        return;
      }
    }

    this.setMeta({
      title: this.siteName,
      description: this.slogan,
      image: this.defaultImage,
      url: path,
    });
  }

  private setMeta(meta: {
    title: string;
    description: string;
    image: string;
    url: string;
  }) {
    const imageUrl = this.toAbsoluteUrl(meta.image);
    const pageUrl = this.toAbsoluteUrl(meta.url);

    this.title.setTitle(meta.title);
    this.updateNameTag('description', meta.description);

    this.updatePropertyTag('og:title', meta.title);
    this.updatePropertyTag('og:description', meta.description);
    this.updatePropertyTag('og:type', 'website');
    this.updatePropertyTag('og:image', imageUrl);
    this.updatePropertyTag('og:url', pageUrl);

    this.updateNameTag('twitter:card', 'summary_large_image');
    this.updateNameTag('twitter:title', meta.title);
    this.updateNameTag('twitter:description', meta.description);
    this.updateNameTag('twitter:image', imageUrl);
  }

  private buildTitle(ogTitle?: string) {
    return ogTitle?.trim()
      ? `${ogTitle.trim()} | ${this.siteName}`
      : this.siteName;
  }

  private updateNameTag(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }

  private updatePropertyTag(property: string, content: string) {
    this.meta.updateTag({ property, content });
  }

  private toAbsoluteUrl(value: string) {
    if (!value) {
      return this.siteOrigin;
    }
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    return `${this.siteOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
  }

  private normalizePath(path: string) {
    const clean = `/${(path || '/').split('?')[0].split('#')[0]}`
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');
    return clean || '/';
  }

  private cleanText(value?: string) {
    if (!value) {
      return '';
    }
    return value
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
