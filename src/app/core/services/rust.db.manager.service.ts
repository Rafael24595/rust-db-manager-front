import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
import { UtilsService } from './utils/utils.service';
import { GenerateDatabaseQuery } from '../../interfaces/server/data.base/generate.data.base.quey';
import { Service } from '../../interfaces/server/service/definition/service';
import { CollectionDefinition } from '../../interfaces/server/collection/collection.definition';
import { GenerateCollectionQuery } from '../../interfaces/server/collection/generate.collection.query';
import { DocumentData } from '../../interfaces/server/document/document.data';
import { DocumentKey } from '../../interfaces/server/document/document.key';
import { UpdateDocument } from '../../interfaces/update.document';
import { DocumentSchema } from '../../interfaces/server/document/document.schema';
import { RenameCollectionQuery } from '../../interfaces/server/collection/rename.collection.query';

const CREDENTIALS_OPTIONS = { withCredentials: true };

@Injectable({
  providedIn: 'root'
})
export class RustDbManagerService {


  constructor(private http: HttpClient, private utils: UtilsService) { }

  metadata(): Observable<ServerStatus> {
    return this.http.get<ServerStatus>(`${environment.URL_SERVICE}/api/v1/metadata`);
  }

  available(): Observable<ServiceCategoryLite[]> {
    return this.http.get<ServiceCategoryLite[]>(`${environment.URL_SERVICE}/api/v1/available`);
  }
  

  serviceFindAll(): Observable<PaginatedCollection<ServiceLite>> {
    return this.http.get<PaginatedCollection<ServiceLite>>(`${environment.URL_SERVICE}/api/v1/service`);
  }

  serviceFind(service: string): Observable<Service> {
    return this.http.get<Service>(`${environment.URL_SERVICE}/api/v1/service/${service}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  serviceInsert(request: ServiceCreateRequest): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/api/v1/service`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  serviceSuscribe(request: ServiceSuscribeRequest): Observable<void> {
    return this.http.patch<void>(`${environment.URL_SERVICE}/api/v1/service`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  serviceRemove(service: string): Observable<void> {
    return this.http.delete<void>(`${environment.URL_SERVICE}/api/v1/service/${service}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  serviceStatus(service: string): Observable<string> {
    return this.http.get(`${environment.URL_SERVICE}/api/v1/service/${service}/status`, { withCredentials: true, responseType: 'text' });
  }

  serviceMetadata(service: string): Observable<TableDataGroup[]> {
    return this.http.get<TableDataGroup[]>(`${environment.URL_SERVICE}/api/v1/service/${service}/metadata`, CREDENTIALS_OPTIONS)
      .pipe(
        map(this.utils.sortDataBaseGroups),
        catchError(this.handleError)
      );
  }

  serviceSchema(service: string): Observable<CollectionDefinition> {
    return this.http.get<CollectionDefinition>(`${environment.URL_SERVICE}/api/v1/service/${service}/schema`, CREDENTIALS_OPTIONS)
      .pipe(
        map(this.utils.sortCollectionDefinition),
        catchError(this.handleError)
      );
  }


  dataBaseFindAll(service: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataBaseInsert(service: string, request: GenerateDatabaseQuery): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataBaseRemove(service: string, database: string): Observable<void> {
    return this.http.delete<void>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  dataBaseMetadata(service: string, database: string): Observable<TableDataGroup[]> {
    return this.http.get<TableDataGroup[]>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/metadata`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }


  collectionFindAll(service: string, database: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionInsert(service: string, request: GenerateCollectionQuery): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${request.data_base}/collection`, request, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionRemove(service: string, database: string, collection: string): Observable<void> {
    return this.http.delete<void>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionRename(service: string, database: string, collection: string, rename: RenameCollectionQuery): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/rename`, rename, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  collectionMetadata(service: string, database: string, collection: string): Observable<TableDataGroup[]> {
    return this.http.get<TableDataGroup[]>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/metadata`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionShema(service: string, database: string, collection: string): Observable<DocumentSchema> {
    return this.http.get<DocumentSchema>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/schema`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionExport(service: string, database: string, collection: string): Observable<DocumentData[]> {
    return this.http.get<DocumentData[]>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/export`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  collectionImport(service: string, database: string, collection: string, documents: string[]): Observable<void> {
    return this.http.post<void>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/export`, documents, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }


  documentFindAll(service: string, database: string, collection: string): Observable<DocumentData[]> {
    return this.http.get<DocumentData[]>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/document/find`, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  documentFind(service: string, database: string, collection: string, document: DocumentKey[]): Observable<DocumentData> {
    return this.http.post<DocumentData>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/document/find`, document, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  documentInsert(service: string, database: string, collection: string, document: UpdateDocument): Observable<DocumentData> {
    return this.http.post<DocumentData>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/document/action`, document, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  documentUpdate(service: string, database: string, collection: string, document: UpdateDocument): Observable<DocumentData> {
    return this.http.put<DocumentData>(`${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/document/action`, document, CREDENTIALS_OPTIONS)
      .pipe(
        catchError(this.handleError)
      );
  }

  documentDelete(service: string, database: string, collection: string, document: DocumentKey[]): Observable<DocumentData> {
    return this.http.request<DocumentData>('delete', `${environment.URL_SERVICE}/api/v1/service/${service}/data-base/${database}/collection/${collection}/document/action`, { withCredentials: true, body: document })
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