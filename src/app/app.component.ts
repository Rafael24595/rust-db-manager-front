import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/index/header/header.component';
import { BodyComponent } from './pages/index/body/body.component';
import { AlertModalComponent } from './components/alert.modal/alert.modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, BodyComponent, AlertModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rust_db_manager_front';
}
