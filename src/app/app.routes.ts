import { Routes } from '@angular/router';
import { AppAboutUsComponent } from './views/about-us/about-us.component';
import { AppHomeComponent } from './views/home/home.component';
import { AppProjectsComponent } from './views/projects/projects.component';

export const routes: Routes = [
  // The landing page is the default route
  { path: '', component: AppHomeComponent },
  // The about page is available via the `/about` route
  { path: 'about', component: AppAboutUsComponent },
  // The projects page is available via the `/projects` route
  { path: 'projects', component: AppProjectsComponent },
  // Individual project pages
  { path: 'projects/:id', component: AppProjectsComponent },
];
