import { Component } from '@angular/core';
import { AlertService } from '../../../../../core/services/alert.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { DataBaseGroup } from '../../../../../interfaces/metadata/data.base.group';
import { DataBaseField } from '../../../../../interfaces/metadata/data.base.field';

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './table.data.component.html',
  styleUrl: './table.data.component.css'
})
export class TableDataComponent {

  public service!: string;

  public metadata!: Observable<DataBaseGroup[]>;

  constructor(private route: ActivatedRoute, private alert: AlertService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const route = this.route.snapshot.paramMap.get('id');
    this.service = route ? route : "";
    this.refreshData();
  }

  refreshData() {
    this.metadata = this.resolver.serviceMetadata(this.service);
  }

  groupInPairs(collection: DataBaseField[]) {
    const pairs = [];
  
    for (let i = 0; i < collection.length; i += 2) {
      if (i + 1 < collection.length) {
        pairs.push([collection[i], collection[i + 1]]);
      } else {
        pairs.push([collection[i]]);
      }
    }
  
    return pairs;
  }

}