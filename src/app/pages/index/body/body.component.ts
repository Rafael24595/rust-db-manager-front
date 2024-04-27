import { Component } from '@angular/core';
import { TableServicesComponent } from '../components/table.services/table.services.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [TableServicesComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}