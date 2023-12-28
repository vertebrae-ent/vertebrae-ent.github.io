import { bootstrapApplication } from '@angular/platform-browser';

import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { AppAboutUsComponent } from './app/views/about-us/about-us.component';
import { AppMainComponent } from './app/views/landing-page/landing-page.component';
import { AppProjectsComponent } from './app/views/projects/projects.component';

/**
 * This is the main entry point.
 * It is responsible for bootstrapping the application
 * and providing the router configuration.
 *
 * It bootstraps the `AppComponent` (./app/app.component.ts) as the root component.
 *
 * The router configuration is provided via the `provideRouter` function.
 * This function takes an array of routes, where each route is an object
 * with a `path` and a `component` property.
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      // The landing page is the default route
      { path: '', component: AppMainComponent },
      // The about page is available via the `/about` route
      { path: 'about', component: AppAboutUsComponent },
      // The projects page is available via the `/projects` route
      { path: 'projects', component: AppProjectsComponent },
    ]),
  ],
}).catch((err) => console.error(err));
