import { Component, ViewChild } from '@angular/core';
import { TableElementsComponent } from "./table.elements/table.elements.component";
import { TableDataComponent } from './table.data/table.data.component';
import { DbLogoService } from '../../../../core/services/view/db.logo.service';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  imports: [TableElementsComponent, TableDataComponent]
})
export class ServicesComponent {

  @ViewChild('table_element') tableElement!: TableElementsComponent;
  @ViewChild('table_data') tableData!: TableDataComponent;

  constructor(private logo: DbLogoService) {
  }

  ngOnInit(): void {
    this.logo.unset();
  }

  refreshChilds() {
    this.tableElement.refreshData();
    this.tableData.refreshData()
  }

}