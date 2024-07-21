import { Component } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableDataGroup } from '../../../../../interfaces/server/table/group/data.base.group';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { AlertService } from '../../../../../core/services/view/alert.service';

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.data.component.html',
  styleUrl: './table.data.component.css'
})
export class TableDataComponent {

  protected service!: string;

  protected metadata!: TableDataGroup[];

  public constructor(private route: ActivatedRoute, public utils: UtilsService, private alert: AlertService, private resolver: RustDbManagerService) {
  }

  protected ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get("service");
    this.service = route ? route : "";

    this.refreshData();
  }

  public refreshData() {
    this.resolver.serviceMetadata(this.service).subscribe({
      error: (e) => {
        this.alert.alert(e.message);
      },
      next: (metadata) => {
        this.metadata = metadata;
      }
    });
  }

}