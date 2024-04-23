import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RustDbManagerService {

  constructor(private http: HttpClient) { }

  findServices() {
    //TODO:
  }
  
}