import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginable } from '../../interfaces/paginable';
import { ServiceLite } from '../../interfaces/service.lite';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServerStatus } from '../../interfaces/server.status';
import { ServiceCategory } from '../../interfaces/service.category';
import { PublishRequest } from '../../interfaces/publish.request';

@Injectable({
  providedIn: 'root'
})
export class RustDbManagerService {

  constructor(private http: HttpClient) { }

  status(): Observable<ServerStatus> {
    return this.http.get<ServerStatus>(`${environment.URL_SERVICE}/status`);
  }

  support(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(`${environment.URL_SERVICE}/support`);
  }

  services(): Observable<Paginable<ServiceLite>> {
    return this.http.get<Paginable<ServiceLite>>(`${environment.URL_SERVICE}/services`);
  }
  
  publish(request: PublishRequest): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/publish`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  remove(service: string): Observable<void> {
    return this.http.delete<void>(`${environment.URL_SERVICE}/${service}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(error.message));
  }

}