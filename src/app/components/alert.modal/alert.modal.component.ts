import { Component } from '@angular/core';
import { AlertData } from '../../interfaces/alert/alert.data';
import { AlertService } from '../../core/services/alert.service';
import { AlertItem } from '../../interfaces/alert/alert.item';
import { UtilsService } from '../../core/services/utils.service';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [],
  templateUrl: './alert.modal.component.html',
  styleUrl: './alert.modal.component.css'
})
export class AlertModalComponent {

  public alerts: AlertItem[];

  constructor(private utils: UtilsService, private alertService: AlertService) {
    this.alerts = [];
  }

  ngOnInit(): void {
    this.alertService.onAlert().subscribe((alert: AlertData) => {
      const item: AlertItem = {
        id: this.utils.uuid(4),
        alert: alert
      };
      this.alerts.push(item);
      if(item.alert.time != undefined) {
        this.resetTimer(item);
      }
    });
  }

  resetTimer(item: AlertItem): void {
    const timeoutId = window.setTimeout(() => {
      this.close(item);
      window.clearTimeout(timeoutId);
    }, item.alert.time);
  }

  close(item: AlertItem) {
    const index = this.alerts.indexOf(item);
    this.alerts.splice(index, 1);
  }
  
}