import { Injectable } from '@angular/core';
import { ResponseException } from '../commons/response.exception';
import { AlertService } from './view/alert.service';
import { ServiceSuscribeService } from './view/service.suscribe.service';
import { ServiceSuscribe } from '../../interfaces/service.suscribe';
import { UtilsService } from './utils/utils.service';
import { AuthAction } from '../../interfaces/auth.action';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor(private alert: AlertService, private utils: UtilsService, private suscribe: ServiceSuscribeService) {
  }

  autentication(e: ResponseException, action: AuthAction): boolean {
    let status = e.status;
    if(status == 404) {
      this.alert.alert(`${action.key} ${action.name} not found.`);
      if(action.exitCallback) {
        this.utils.executeCallback(action.exitCallback);
      }
      return true;
    }

    if(status == 405) {
      return false;
    }

    if(status && status > 399 && status < 500) {
      const service: ServiceSuscribe = {
        service: action.service,
        nextCallback: action.nextCallback,
        exitCallback: action.exitCallback
      };
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