import { Component } from '@angular/core';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TableDataGroup } from '../../../../../interfaces/server/table/data.base.group';
import { UtilsService } from '../../../../../core/services/utils.service';

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './table.data.component.html',
  styleUrl: './table.data.component.css'
})
export class TableDataComponent {

  public service!: string;

  public metadata!: Observable<TableDataGroup[]>;

  constructor(private route: ActivatedRoute, public utils: UtilsService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get("service");
    this.service = route ? route : "";
    this.refreshData();
  }

  refreshData() {
    this.metadata = this.resolver.serviceMetadata(this.service);
  }

}