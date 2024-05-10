import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedCollection } from '../../interfaces/server/pagination/paginated.collection';
import { ServiceLite } from '../../interfaces/server/service/definition/service.lite';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServerStatus } from '../../interfaces/server/server.status';
import { ServiceCategoryLite } from '../../interfaces/server/service/definition/service.category.lite';
import { ServiceCreateRequest } from '../../interfaces/server/service/generate/service.create.request';
import { ServiceSuscribeRequest } from '../../interfaces/server/service/generate/service.suscribe.request';
import { ResponseException } from '../commons/response.exception';
import { TableDataGroup } from '../../interfaces/server/table/data.base.group';
import { UtilsService } from './utils.service';
import { GenerateDatabaseQuery } from '../../interfaces/server/data.base/generate.data.base.quey';
import { Service } from '../../interfaces/server/service/definition/service';
import { CollectionDefinition } from '../../interfaces/server/collection/collection.definition';
import { GenerateCollectionQuery } from '../../interfaces/server/collection/generate.collection.query';
import { DocumentData } from '../../interfaces/server/document/document.data';

const CREDENTIALS_OPTIONS = { withCredentials: true };

@Injectable({
  providedIn: 'root'
})
export class RustDbManagerService {


  constructor(private http: HttpClient, private utils: UtilsService) { }

  metadata(): Observable<ServerStatus> {
    return this.http.get<ServerStatus>(`${environment.URL_SERVICE}/metadata`);
  }

  support(): Observable<ServiceCategoryLite[]> {
    return this.http.get<ServiceCategoryLite[]>(`${environment.URL_SERVICE}/support`);
  }

  services(): Observable<PaginatedCollection<ServiceLite>> {
    return this.http.get<PaginatedCollection<ServiceLite>>(`${environment.URL_SERVICE}/services`);
  }
  
  publish(request: ServiceCreateRequest): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/publish`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  suscribe(request: ServiceSuscribeRequest): Observable<void> {
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

  serviceMetadata(service: string): Observable<TableDataGroup[]> {
    return this.http.get<TableDataGroup[]>(`${environment.URL_SERVICE}/${service}/metadata`, CREDENTIALS_OPTIONS)
      .pipe(
        map(this.utils.sortDataBaseGroups),
        catchError(this.handleError)
      );
  }

  serviceDefinition(service: string): Observable<CollectionDefinition> {
    return this.http.get<CollectionDefinition>(`${environment.URL_SERVICE}/${service}/definition`, CREDENTIALS_OPTIONS)
      .pipe(
        map(this.utils.sortCollectionDefinition),
        catchError(this.handleError)
      );
  }

  dataBaseFindAll(service: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.URL_SERVICE}/${service}/data-base`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataBaseCreate(service: string, request: GenerateDatabaseQuery): Observable<void> {
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

  dataBaseStatus(service: string, database: string): Observable<TableDataGroup[]> {
    return this.http.get<TableDataGroup[]>(`${environment.URL_SERVICE}/${service}/data-base/${database}/metadata`, CREDENTIALS_OPTIONS)
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

  collectionFindAll(service: string, database: string, collection: string): Observable<DocumentData[]> {
    return this.http.get<DocumentData[]>(`${environment.URL_SERVICE}/${service}/data-base/${database}/collection/${collection}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  collectionCreate(service: string, request: GenerateCollectionQuery): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/${service}/data-base/${request.data_base}/collection`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionStatus(service: string, database: string, collection: string): Observable<TableDataGroup[]> {
    return this.http.get<TableDataGroup[]>(`${environment.URL_SERVICE}/${service}/data-base/${database}/collection/${collection}/metadata`, CREDENTIALS_OPTIONS)
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