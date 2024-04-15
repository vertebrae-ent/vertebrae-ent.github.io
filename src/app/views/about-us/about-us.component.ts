import { Component, computed, inject, signal } from '@angular/core';
import { CMSPeople } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  standalone: true,
  imports: [],
})
export class AppAboutUsComponent {
  service = inject(AppService);
  config = computed(() => this.service.config().about);
  selectedPerson = signal<CMSPeople | undefined>(undefined);

  selectPerson(person: CMSPeople) {
    if (this.selectedPerson() === person) {
      this.selectedPerson.set(undefined);
    } else {
      this.selectedPerson.set(person);
    }
  }
}
