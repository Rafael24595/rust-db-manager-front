import { Component } from '@angular/core';
import { TableDataGroup } from '../../../../../interfaces/server/table/group/data.base.group';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { TableDataField } from '../../../../../interfaces/server/table/group/data.base.field';

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
        const status = e.status;
        if(status != 401 && status != 403) {
          this.alert.alert(e.message);
        }
      },
      next: (metadata) => {
        this.metadata = metadata;
      }
    });
  }

  formatField(field: TableDataField) {
    console.log(field)
    switch (field.data_type.toLowerCase()) {
      case "byte":
        return this.formatBytes(Number(field.value))
      default:
        return field.value;
    }
  }

  formatBytes(bytes: number): string {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (Math.round(gb) > 0) {
        return `${gb.toFixed(2)} GB`;
    }
    if (Math.round(mb) > 0) {
        return `${mb.toFixed(2)} MB`;
    }
    if (Math.round(kb) > 0) {
        return `${kb.toFixed(2)} KB`;
    }

    return `${bytes.toFixed(2)} Bytes`;
}

}