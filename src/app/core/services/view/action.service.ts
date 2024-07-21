import { Injectable } from '@angular/core';
import { ActionDefinition } from '../../../interfaces/server/action/definition/action.definition';
import { Observable, Subject } from 'rxjs';
import { RedirectService } from '../redirect.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private subject = new Subject<ActionDefinition>();

  constructor(private redirect: RedirectService) {
  }

  onRequest(): Observable<ActionDefinition> {
    return this.subject.asObservable();
  }

  suscribe(request: ActionDefinition, service: string, dataBase: string, collection?: string) {
    this.subject.next(request);
    
  }
  
}
