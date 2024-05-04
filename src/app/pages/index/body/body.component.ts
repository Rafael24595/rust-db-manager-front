import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuscribeFormComponent } from '../components/suscribe.form/suscribe.form.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterOutlet, SuscribeFormComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}