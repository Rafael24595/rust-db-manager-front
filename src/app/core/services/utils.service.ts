import { Injectable } from '@angular/core';
import { DataBaseGroup } from '../../interfaces/metadata/data.base.group';
import { Callback } from '../../interfaces/callback';
import { DataBaseField } from '../../interfaces/metadata/data.base.field';
import { CollectionDefinition } from '../../interfaces/definition/collection.definition';

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

  sortCollectionDefinition(data: CollectionDefinition) {
    data.definition = data.definition.sort((g1, g2) => g1.order - g2.order);
    return data;
  }

  executeCallback(callback: Callback) {
    if(callback.args != undefined) {
      return callback.func(...callback.args);
    }
    return callback.func();
  }

  groupInPairs(collection: DataBaseField[]) {
    const pairs = [];
  
    for (let i = 0; i < collection.length; i += 2) {
      if (i + 1 < collection.length) {
        pairs.push([collection[i], collection[i + 1]]);
      } else {
        pairs.push([collection[i]]);
      }
    }
  
    return pairs;
  }

  downloadFile(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain" });

    const a = document.createElement("a");
    a.style.display = "none";
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }

}