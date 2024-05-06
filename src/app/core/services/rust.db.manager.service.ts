import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginable } from '../../interfaces/response/paginable';
import { ServiceLite } from '../../interfaces/response/service.lite';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServerStatus } from '../../interfaces/response/server.status';
import { ServiceCategory } from '../../interfaces/response/service.category';
import { PublishRequest } from '../../interfaces/request/publish.request';
import { SuscribeRequest } from '../../interfaces/request/suscribe.request';
import { ResponseException } from '../commons/response.exception';
import { DataBaseGroup } from '../../interfaces/metadata/data.base.group';
import { UtilsService } from './utils.service';
import { CreateDBRequest } from '../../interfaces/request/create.db.request';
import { Service } from '../../interfaces/response/service';

const CREDENTIALS_OPTIONS = { withCredentials: true };

@Injectable({
  providedIn: 'root'
})
export class RustDbManagerService {


  constructor(private http: HttpClient, private utils: UtilsService) { }

  metadata(): Observable<ServerStatus> {
    return this.http.get<ServerStatus>(`${environment.URL_SERVICE}/metadata`);
  }

  support(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(`${environment.URL_SERVICE}/support`);
  }

  services(): Observable<Paginable<ServiceLite>> {
    return this.http.get<Paginable<ServiceLite>>(`${environment.URL_SERVICE}/services`);
  }
  
  publish(request: PublishRequest): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/publish`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  suscribe(request: SuscribeRequest): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/suscribe`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  find(service: string): Observable<Service> {
    return this.http.get<Service>(`${environment.URL_SERVICE}/${service}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  remove(service: string): Observable<void> {
    return this.http.delete<void>(`${environment.URL_SERVICE}/${service}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  serviceStatus(service: string): Observable<string> {
    return this.http.get(`${environment.URL_SERVICE}/${service}/status`, { withCredentials: true, responseType: 'text' });
  }

  serviceMetadata(service: string): Observable<DataBaseGroup[]> {
    return this.http.get<DataBaseGroup[]>(`${environment.URL_SERVICE}/${service}/metadata`, CREDENTIALS_OPTIONS)
      .pipe(
        map(this.utils.sortDataBaseGroups),
        catchError(this.handleError)
      );
  }

  dataBaseFindAll(service: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.URL_SERVICE}/${service}/data-base`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataBaseCreate(service: string, request: CreateDBRequest): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/${service}/data-base`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataBaseDrop(service: string, database: string): Observable<void> {
    return this.http.delete<void>(`${environment.URL_SERVICE}/${service}/data-base/${database}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataBaseStatus(service: string, database: string): Observable<DataBaseGroup[]> {
    return this.http.get<DataBaseGroup[]>(`${environment.URL_SERVICE}/${service}/data-base/${database}/metadata`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionFindAllLite(service: string, database: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.URL_SERVICE}/${service}/data-base/${database}/collection`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionDrop(service: string, database: string, collection: string): Observable<void> {
    return this.http.delete<void>(`${environment.URL_SERVICE}/${service}/data-base/${database}/collection/${collection}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionFindAll(service: string, database: string, collection: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.URL_SERVICE}/${service}/data-base/${database}/collection/${collection}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: '${error.error}'`);
    }
    return throwError(() => new ResponseException(error.status, error.message, error.error));
  }

}