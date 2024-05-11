import { Injectable } from '@angular/core';
import { Service } from '../../../interfaces/server/service/definition/service';
import { Observable, Subject, map } from 'rxjs';
import { RustDbManagerService } from '../rust.db.manager.service';

@Injectable({
  providedIn: 'root'
})
export class DbLogoService {

  private subject = new Subject<Service | undefined>();

  constructor(private resolver: RustDbManagerService) {
  }

  onEvent(): Observable<Service | undefined> {
    return this.subject.asObservable();
  }

  set(serviceName: string) {
    this.resolver.find(serviceName).pipe(
      map(service => {
        if (service) {
          this.subject.next(service);
        } else {
          console.error(`Service ${serviceName} not found.`);
        }
      })
    ).subscribe();
  }

  unset() {
    this.subject.next(undefined)
  }

}
