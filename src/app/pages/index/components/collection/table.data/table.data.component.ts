import { Component } from '@angular/core';
import { TableDataGroup } from '../../../../../interfaces/server/table/group/data.base.group';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../../core/services/view/alert.service';

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.data.component.html',
  styleUrl: './table.data.component.css'
})
export class TableDataComponent {

  public service!: string;
  public dataBase!: string;

  public metadata!: TableDataGroup[];

  constructor(private route: ActivatedRoute, public utils: UtilsService, private alert: AlertService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";

    this.refreshData();
  }

  refreshData() {
    this.resolver.dataBaseMetadata(this.service, this.dataBase).subscribe({
      error: (e) => {
        this.alert.alert(e.message);
      },
      next: (metadata) => {
        this.metadata = metadata;
      }
    });
  }

}