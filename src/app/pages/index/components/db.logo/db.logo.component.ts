import { Component } from '@angular/core';
import { DbLogoService } from '../../../../core/services/db.logo.service';
import { Service } from '../../../../interfaces/server/service/definition/service';

@Component({
  selector: 'app-db-logo',
  standalone: true,
  imports: [],
  templateUrl: './db.logo.component.html',
  styleUrl: './db.logo.component.css'
})
export class DbLogoComponent {

  public service: Service | undefined;

  constructor(private logo: DbLogoService) {
  }

  ngOnInit(): void {
    this.logo.onEvent().subscribe((service: Service | undefined) => this.service = service);
  }

}