import { Component, OnInit, computed, inject } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  standalone: true,
  imports: [],
})
export class AppAboutUsComponent implements OnInit {
  service = inject(AppService);
  config = computed(() => this.service.config().about);

  ngOnInit() {}
}
