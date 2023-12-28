import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  template: ` <h1>About Us</h1> `,
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
export class AppAboutUsComponent {}
