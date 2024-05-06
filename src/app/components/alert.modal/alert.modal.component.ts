import { Component } from '@angular/core';
import { AlertData } from '../../interfaces/alert/alert.data';
import { AlertService } from '../../core/services/alert.service';
import { AlertItem } from '../../interfaces/alert/alert.item';
import { UtilsService } from '../../core/services/utils.service';
import { CommonModule } from '@angular/common';

const MAX_VIEW: number = 3;

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.modal.component.html',
  styleUrl: './alert.modal.component.css'
})
export class AlertModalComponent {

  public queue: AlertItem[];
  public alerts: AlertItem[];

  constructor(private utils: UtilsService, private alert: AlertService) {
    this.queue = [];
    this.alerts = [];
  }

  ngOnInit(): void {
    this.alert.onAlert().subscribe((alert: AlertData) => {
      const item: AlertItem = {
        id: this.utils.uuid(4),
        alert: alert
      };
      this.push(item);
      if(item.alert.time != undefined && item.alert.time != 0) {
        this.resetTimer(item);
      }
    });
  }

  private push(item: AlertItem ) {
    if(this.alerts.length >= MAX_VIEW) {
      this.queue.push(item);
      return;
    }
    this.alerts.push(item);
  }

  private resetTimer(item: AlertItem): void {
    const timeoutId = window.setTimeout(() => {
      this.close(item);
      window.clearTimeout(timeoutId);
    }, item.alert.time);
  }

  close(item: AlertItem) {
    const index = this.alerts.indexOf(item);
    this.alerts.splice(index, 1);
    if(this.alerts.length < MAX_VIEW) {
      const newItem = this.queue.shift();
      if(newItem) {
        this.alerts.push(newItem);
      }
    }
  }
  
}