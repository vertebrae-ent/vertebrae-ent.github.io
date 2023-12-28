import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  template: ` <h1>Projects</h1> `,
  styles: `
  :host {
    display: block;
    margin-top: 6em;
    margin-bottom: 6rem;
    @media screen and (max-width: 980px) {
      margin-bottom: 18rem;
    }
  }
`,
  standalone: true,
  imports: [],
})
export class AppProjectsComponent {}
