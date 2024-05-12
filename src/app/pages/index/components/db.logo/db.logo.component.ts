import { Component } from '@angular/core';
import { DbLogoService } from '../../../../core/services/view/db.logo.service';
import { LogoTitle } from '../../../../interfaces/logo.title';

@Component({
  selector: 'app-db-logo',
  standalone: true,
  imports: [],
  templateUrl: './db.logo.component.html',
  styleUrl: './db.logo.component.css'
})
export class DbLogoComponent {

  public title: LogoTitle | undefined;

  constructor(private logo: DbLogoService) {
  }

  ngOnInit(): void {
    this.logo.onEvent().subscribe((title: LogoTitle | undefined) => this.title = title);
  }

}