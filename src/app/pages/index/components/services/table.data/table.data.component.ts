import { Component } from '@angular/core';
import { ServerStatus } from '../../../../../interfaces/server.status';
import { Observable } from 'rxjs';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './table.data.component.html',
  styleUrls: ['../../../../../app.component.css', './table.data.component.css']
})
export class TableDataComponent {

  public status$!: Observable<ServerStatus>;
  private idPollData: number;

  constructor(private service: RustDbManagerService) {
    this.idPollData = 0;
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    clearInterval(this.idPollData)
  }

  refreshData() {
    this.status$ = this.service.serverStatus();
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toString();
  }

  executionTime(timestamp: number): string {
    const now = Date.now();
    const difference = Math.abs(now - timestamp);

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

}