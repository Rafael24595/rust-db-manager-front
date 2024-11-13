import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  public apiUrl: string = '';

  constructor() {
    if(typeof window !== 'undefined' && environment.URL_SERVICE_HOST == "") {
      this.apiUrl = `${window.location.protocol}//${window.location.hostname}:${environment.URL_SERVICE_PORT}`;
      environment.URL_SERVICE_HOST = this.apiUrl;
    } else {
      this.apiUrl = environment.URL_SERVICE_HOST;
    }
  }

}
