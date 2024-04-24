import { Component } from '@angular/core';
import { ServicesComponent } from '../components/services/services.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [ServicesComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}