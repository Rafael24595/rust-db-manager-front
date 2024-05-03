import { Component, ViewChild } from '@angular/core';
import { ServiceLite } from '../../../../../interfaces/service.lite';
import { Observable } from 'rxjs';
import { Paginable } from '../../../../../interfaces/paginable';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';
import { ServiceFormComponent } from '../service.form/service.form.component';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent, DialogFormComponent, ServiceFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableServicesComponent {
  
  @ViewChild(DialogFormComponent) dialog!: DialogFormComponent;
  @ViewChild(ServiceFormComponent) form!: ServiceFormComponent;

  public services!: Observable<Paginable<ServiceLite>>;

  constructor(private service: RustDbManagerService) {}

  ngOnInit(): void {
    this.services = this.service.services();
  }

  refreshServices() {
    this.services = this.service.services();
  }

  openModal() {
    this.dialog.openModal();
  }

  closeModal() {
    this.dialog.closeModal();
  }

  onSubmit() {
    this.form.onSubmit();
  }

  remove(code: string) {
    this.service.remove(code).subscribe({
      error: (e) => {alert(e); console.error(e)},
      complete: () => this.refreshServices()
    });
  }

}