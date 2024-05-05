import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService } from '../../../../../core/services/alert.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  public dataBases!: Observable<String[]>;

  constructor(private alert: AlertService, private service: RustDbManagerService) {
  }

}
