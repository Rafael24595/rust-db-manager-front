import { Component, Input, ViewChild } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ServiceCategory } from '../../../../../interfaces/response/service.category';
import { FormsModule } from '@angular/forms';
import { PublishRequest } from '../../../../../interfaces/request/publish.request';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'app-publish-form',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './publish.form.component.html',
  styleUrl: './publish.form.component.css'
})
export class PublishFormComponent {
  
  @Input() closeModal: Function;
  @Input() refreshData: Function;

  public categories!: Observable<ServiceCategory[]>;
  
  public category: string;
  public name: string;
  public connection: string;
  public secure: boolean;

  public showPassword: boolean;
  public password: string;

  constructor(private alert: AlertService, private resolver: RustDbManagerService) {
    this.closeModal = () => {};
    this.refreshData = () => {};
    this.category = "";
    this.name = "";
    this.connection = "";
    this.secure = false;
    this.showPassword = false;
    this.password = "";
  }

  ngOnInit(): void {
    this.categories = this.resolver.support();
  }

  onSubmit(attemps: number = 0) {
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
    
    this.resolver.publish(request).subscribe({
      error: (e: ResponseException) => {
        console.error(`${e}\nNumber of attemps: ${attemps+1}`);
        if(attemps > 1) {
          this.alert.alert(e.message);
          return;
        }
        console.error(`${e}\nTrying to enable a new connection.`);
        this.onSubmit(attemps+1);
      },
      complete: () => {
        this.closeModal();
        this.refreshData();
        this.cleanForm();
      }
    });
  }

  cleanForm() {
    this.category = "";
    this.name = "";
    this.connection = "";
    this.secure = false;
    this.password = "";
    this.showPassword = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}