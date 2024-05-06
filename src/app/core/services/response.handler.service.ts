import { Injectable } from '@angular/core';
import { ResponseException } from '../commons/response.exception';
import { AlertService } from './alert.service';
import { ServiceSuscribeService } from './service.suscribe.service';
import { ServiceSuscribe } from '../../interfaces/service.suscribe';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor(private alert: AlertService, private utils: UtilsService, private suscribe: ServiceSuscribeService) {
  }

  autentication(e: ResponseException, service: ServiceSuscribe): boolean {
    let status = e.status;
    if(status == 404) {
      this.alert.alert(`Service ${service.service} not found.`);
      if(service.closeCallback) {
        this.utils.executeCallback(service.closeCallback);
      }
      return true;
    }

    if(status && status > 399 && status < 500) {
      this.suscribe.suscribe(service);
      return true;
    }

    return false;
  }

  requestAttemp(e: ResponseException, func: (attemps: number) => void, attemps: number = 0) {
    console.error(`${e}\nNumber of attemps: ${attemps+1}`);
    if(attemps > 1) {
      this.alert.alert(e.message);
      return;
    }
    console.error(`${e}\nTrying to enable a new connection.`);
    func(attemps+1);
  }

}