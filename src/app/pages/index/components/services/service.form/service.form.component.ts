import { Component, Input, ViewChild } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ServiceCategory } from '../../../../../interfaces/service.category';
import { FormsModule } from '@angular/forms';
import { PublishRequest } from '../../../../../interfaces/publish.request';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './service.form.component.html',
  styleUrl: './service.form.component.css'
})
export class ServiceFormComponent {
  
  @Input() closeModal: Function;
  @Input() refreshData: Function;

  public categories!: Observable<ServiceCategory[]>;
  
  public category: string;
  public name: string;
  public connection: string;
  public secure: boolean;

  public showPassword: boolean;
  public password: string;

  constructor(private service: RustDbManagerService) {
    this.closeModal = () => {};
    this.refreshData = () => {};
    this.category = "";
    this.name = "";
    this.connection = "";
    this.secure = false;
    this.password = "";
    this.showPassword = false;
  }

  ngOnInit(): void {
    this.categories = this.service.support();
  }

  onSubmit() {
    const request: PublishRequest = {
      name: this.name,
      owner: "Client",
      protected: this.secure,
      password: this.password,
      connection_data: {
        category: this.category,
        connection: this.connection
      }
    };
    
    this.service.publish(request).subscribe({
      error: (e) => {alert(e); console.error(e)},
      complete: () => {this.closeModal(), this.refreshData()}
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}