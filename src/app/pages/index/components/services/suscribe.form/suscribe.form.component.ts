import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SuscribeRequest } from '../../../../../interfaces/request/suscribe.request';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { Callback } from '../../../../../interfaces/callback';

@Component({
  selector: 'app-suscribe-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suscribe.form.component.html',
  styleUrl: './suscribe.form.component.css'
})
export class SuscribeFormComponent {

  @Input() closeModal: Function;
  @Input() next: Callback<any>;
  @Input() pointer!: string;

  public showPassword: boolean;
  public password: string;

  constructor(private service: RustDbManagerService) {
    this.closeModal = () => {};
    this.next = {func: () => {}};
    this.showPassword = false;
    this.password = "";
  }

  onSubmit() {
    const request: SuscribeRequest = {
      name: this.pointer,
      owner: "Client",
      password: this.password
    };
    
    this.service.suscribe(request).subscribe({
      error: (e: ResponseException) => {
        const message = "Incorrect password."
        //TODO: Use custom alert infrastructure.
        alert(message);

        console.error(e);
      },
      complete: () => {
        this.closeModal();
        this.cleanForm();
        this.next.func(this.next.args);
      }
    });
  }

  cleanForm() {
    this.password = "";
    this.showPassword = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}