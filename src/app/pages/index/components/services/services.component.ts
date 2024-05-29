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

  @ViewChild('table_element')
  private tableElement!: TableElementsComponent;
  @ViewChild('table_data')
  private tableData!: TableDataComponent;

  public constructor(private logo: DbLogoService) {
  }

  protected ngOnInit(): void {
    this.logo.unset();
  }

  protected refreshChilds(): void {
    this.tableElement.refreshData();
    this.tableData.refreshData()
  }

}