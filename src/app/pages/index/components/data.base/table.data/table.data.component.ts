import { Component } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TableDataGroup } from '../../../../../interfaces/server/table/group/data.base.group';
import { UtilsService } from '../../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './table.data.component.html',
  styleUrl: './table.data.component.css'
})
export class TableDataComponent {

  protected service!: string;

  protected metadata!: Observable<TableDataGroup[]>;

  public constructor(private route: ActivatedRoute, public utils: UtilsService, private resolver: RustDbManagerService) {
  }

  protected ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get("service");
    this.service = route ? route : "";

    this.refreshData();
  }

  public refreshData() {
    this.metadata = this.resolver.serviceMetadata(this.service);
  }

}