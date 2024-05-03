import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertData } from '../../interfaces/alert/alert.data';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private subject = new Subject<AlertData>();
  
  constructor() { }

  onAlert(): Observable<AlertData> {
    return this.subject.asObservable();
  }

  push(alert: AlertData) {
    this.subject.next(alert);
  }

}