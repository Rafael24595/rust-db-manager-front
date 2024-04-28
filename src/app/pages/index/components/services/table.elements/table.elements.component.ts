import { Component } from '@angular/core';
import { ServiceLite } from '../../../../../interfaces/service.lite';
import { Observable } from 'rxjs';
import { Paginable } from '../../../../../interfaces/paginable';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  templateUrl: './table.elements.component.html',
  styleUrls: ['../../../../../app.component.css', './table.elements.component.css']
})
export class TableServicesComponent {

  public services$!: Observable<Paginable<ServiceLite>>;

  constructor(private service: RustDbManagerService) {}

  ngOnInit(): void {
    this.services$ = this.service.findServices();
  }

}