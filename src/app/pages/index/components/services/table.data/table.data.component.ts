import { Component } from '@angular/core';
import { ServerStatus } from '../../../../../interfaces/server/server.status';
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

  protected metadata!: ServerStatus;

  public constructor(private alert: AlertService, private resolver: RustDbManagerService) {
  }

  protected ngOnInit(): void {
    this.refreshData();
  }

  public refreshData(): void {
    this.resolver.metadata().subscribe({
      error: (e) => {
        this.alert.alert(e.message);
      },
      next: (metadata) => {
        this.metadata = metadata;
      }
    });
  }

  protected formatDate(timestamp: number): string {
    return new Date(timestamp).toString();
  }

  protected executionTime(timestamp: number): string {
    const now = Date.now();
    const difference = Math.abs(now - timestamp);

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

}