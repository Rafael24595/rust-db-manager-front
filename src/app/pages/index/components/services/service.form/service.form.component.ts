import { Component, ViewChild } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ServiceCategory } from '../../../../../interfaces/service.category';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './service.form.component.html',
  styleUrl: './service.form.component.css'
})
export class ServiceFormComponent {
  
  public categories!: Observable<ServiceCategory[]>;
  
  public category!: String;
  public name!: String;
  public connection!: String;
  public secure!: boolean;

  public showPassword: boolean;
  public password!: String;

  constructor(private service: RustDbManagerService) {
    this.showPassword = false
  }

  ngOnInit(): void {
    this.categories = this.service.supportServices();
  }

  onSubmit() {
    console.log('Form submitted!');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}