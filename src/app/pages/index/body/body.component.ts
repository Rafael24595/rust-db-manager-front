import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuscribeFormComponent } from '../components/suscribe.form/suscribe.form.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { DbLogoComponent } from '../components/db.logo/db.logo.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterOutlet, BreadcrumbComponent, SuscribeFormComponent, DbLogoComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}