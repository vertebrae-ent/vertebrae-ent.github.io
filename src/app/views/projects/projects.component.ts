import { Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { CMSSectionTypeSocial } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AppSectionSocialComponent } from '../home/sections/social.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, AppSectionSocialComponent],
})
export class AppProjectsComponent implements OnInit {
  service = inject(AppService);
  route = inject(ActivatedRoute);
  sec = inject(DomSanitizer);

  // The config for this page
  config = computed(() => this.service.config().projects);
  // The social section
  social = computed(() => {
    if (!Array.isArray(this.service.config()?.home)) {
      return {} as CMSSectionTypeSocial;
    }
    return this.service.config().home.filter((s) => s.type === 'social')[0];
  });

  // Fetch the selected project from the route
  selectedRoute = toSignal(this.route.params.pipe(map((p) => p['id'])));
  selected = computed(
    () =>
      this.selectedRoute() &&
      this.config() &&
      this.config().find((project) =>
        project.link.includes(this.selectedRoute()),
      ),
  );

  // Load the timeline posts for the selected project
  timeline = computed(() => {
    return (
      this.selected() &&
      this.selected().timeline.map((t: string) => {
        // Parse the date from the filename
        const [year, month, day] = t
          .replace(/^projects\/(.*)\.md$/, '$1')
          .replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3')
          .split('-');
        const date = new Date(
          parseInt(year.length === 2 ? `20${year}` : year),
          parseInt(month) - 1,
          parseInt(day),
        );
        return {
          date,
          content: this.service.loadPost(t),
        };
      })
    );
  });

  ngOnInit() {}
}
