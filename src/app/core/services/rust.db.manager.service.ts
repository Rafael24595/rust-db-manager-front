import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginable } from '../../interfaces/paginable';
import { ServiceLite } from '../../interfaces/service.lite';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServerStatus } from '../../interfaces/server.status';

@Injectable({
  providedIn: 'root'
})
export class RustDbManagerService {

  constructor(private http: HttpClient) { }

  serverStatus(): Observable<ServerStatus> {
    return this.http.get<ServerStatus>(`${environment.URL_SERVICE}/status`);
  }

  findServices(): Observable<Paginable<ServiceLite>> {
    return this.http.get<Paginable<ServiceLite>>(`${environment.URL_SERVICE}/services`);
  }
  
}