import { Injectable } from '@angular/core';
import { DataBaseGroup } from '../../interfaces/metadata/data.base.group';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  uuid(parts: number): string {
    const stringArr = [];
    for(let i = 0; i< parts; i++){
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  sortDataBaseGroups(data: DataBaseGroup[]) {
    data.sort((g1, g2) => g1.order - g2.order)
      .forEach(g => g.fields.
        sort((f1, f2) => f1.order - f2.order));
    return data;
  }

}
