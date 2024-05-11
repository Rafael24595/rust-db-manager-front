import { Component } from '@angular/core';
import { TableDataGroup } from '../../../../../interfaces/server/table/data.base.group';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './table.data.component.html',
  styleUrl: './table.data.component.css'
})
export class TableDataComponent {

  public service!: string;
  public dataBase!: string;
  public collection!: string;

  public metadata!: Observable<TableDataGroup[]>;

  constructor(private route: ActivatedRoute, public utils: UtilsService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    const oCollection = snapshot.paramMap.get("collection");
    this.collection = oCollection ? oCollection : "";

    this.refreshData();
  }

  refreshData() {
    this.metadata = this.resolver.collectionStatus(this.service, this.dataBase, this.collection);
  }

}