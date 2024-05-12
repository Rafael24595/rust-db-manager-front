import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { RustDbManagerService } from '../rust.db.manager.service';
import { LogoTitle } from '../../../interfaces/logo.title';

@Injectable({
  providedIn: 'root'
})
export class DbLogoService {

  private subject = new Subject<LogoTitle | undefined>();

  constructor(private resolver: RustDbManagerService) {
  }

  onEvent(): Observable<LogoTitle | undefined> {
    return this.subject.asObservable();
  }

  set(title: string, serviceName: string) {
    this.resolver.find(serviceName).pipe(
      map(service => {
        if (service) {
          this.subject.next({
            title, service
          });
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
