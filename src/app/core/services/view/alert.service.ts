import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertData } from '../../../interfaces/alert/alert.data';

const DEFAULT_TIME: number = 6000;

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  
  private subject = new Subject<AlertData>();

  onAlert(): Observable<AlertData> {
    return this.subject.asObservable();
  }

  alert(message: string, title?: string, time: number = DEFAULT_TIME) {
    const alert: AlertData = {
      title: title,
      icon: "⚠",
      color: "#ffeb99",
      message: message,
      time: time
    }
    this.subject.next(alert);
  }

  message(message: string, title?: string, time: number = DEFAULT_TIME) {
    const alert: AlertData = {
      title: title,
      message: message,
      time: time
    }
    this.subject.next(alert);
  }

}