import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { DialogFormComponent } from '../../../../../components/dialog.form/dialog.form.component';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterModule, ComboSelectorComponent, DialogFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @ViewChild('form_dialog') formDialog!: DialogFormComponent;

  public service!: string;

  public dataBases!: Observable<String[]>;

  constructor(private route: ActivatedRoute, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get('id');
    this.service = route ? route : "";
    this.refreshData();
  }

  refreshData() {
    this.dataBases = this.resolver.serviceDatabases(this.service);
  }

  openModal() {
    this.formDialog.openModal();
  }

}