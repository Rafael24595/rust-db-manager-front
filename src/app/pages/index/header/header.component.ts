import { Component } from '@angular/core';
import { RedirectService } from '../../../core/services/redirect.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private redirect: RedirectService) {
  }

  loadHome() {
    this.redirect.goToHome();
  }

}