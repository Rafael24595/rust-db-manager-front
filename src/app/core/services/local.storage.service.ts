import { Injectable } from '@angular/core';
import { Optional } from '../../types/optional';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public find(key: any): Optional<any> {
    const serializedObject = localStorage.getItem(key);
    if (serializedObject) {
      return JSON.parse(serializedObject);
    }
    return null;
  }

  public insert(key: any, object: any): void {
    const serializedObject = JSON.stringify(object);
    localStorage.setItem(key, serializedObject);
  }

  public delete(key: any): void {
    localStorage.removeItem(key);
  }
  
}
