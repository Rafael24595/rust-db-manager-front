import { Component } from '@angular/core';
import { ServiceLite } from '../../../../interfaces/service.lite';
import { Observable } from 'rxjs';
import { Paginable } from '../../../../interfaces/paginable';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-services',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './table.services.component.html',
  styleUrl: './table.services.component.css'
})
export class TableServicesComponent {

  public services$!: Observable<Paginable<ServiceLite>>;
course: any;

  constructor(private service: RustDbManagerService) {}

  ngOnInit(): void {
    this.services$ = this.service.findServices();
  }

}