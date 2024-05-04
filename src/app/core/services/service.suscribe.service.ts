import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ServiceSuscribe } from '../../interfaces/service.suscribe';

@Injectable({
  providedIn: 'root'
})
export class ServiceSuscribeService {

  private subject = new Subject<ServiceSuscribe>();

  constructor() {
  }

  onRequest(): Observable<ServiceSuscribe> {
    return this.subject.asObservable();
  }

  suscribe(request: ServiceSuscribe) {
    this.subject.next(request);
  }

}