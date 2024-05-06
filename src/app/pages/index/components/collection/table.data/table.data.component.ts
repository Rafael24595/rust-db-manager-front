import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataBaseGroup } from '../../../../../interfaces/metadata/data.base.group';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../../core/services/utils.service';
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


  public metadata!: Observable<DataBaseGroup[]>;

  constructor(private route: ActivatedRoute, public utils: UtilsService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const oService = this.route.snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = this.route.snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    this.refreshData();
  }

  refreshData() {
    this.metadata = this.resolver.dataBaseStatus(this.service, this.dataBase);
  }

}