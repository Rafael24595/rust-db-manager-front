import { Injectable } from '@angular/core';
import { TableDataGroup } from '../../../interfaces/server/table/group/data.base.group';
import { Callback } from '../../../interfaces/callback';
import { CollectionDefinition } from '../../../interfaces/server/collection/collection.definition';
import { Optional } from '../../../types/optional';
import { TableDataField } from '../../../interfaces/server/table/group/data.base.field';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public readonly COVERED_WITH_QUOTES = /^"/;
  public readonly IS_KEY = /:$/;
  public readonly IS_BOOLEAN = /true|false/;
  public readonly IS_NULL = /null/;

  constructor() { }

  uuid(parts: number): string {
    const stringArr = [];
    for(let i = 0; i< parts; i++){
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  sortDataBaseGroups(data: TableDataGroup[]) {
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

  groupInPairs<T>(collection: T[]) {
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

  public beautifyDocument(document: string): string {
    return document.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let color = this.pickColor(match);
        return `<span style="color: ${color};">${match}</span>`;
    });
  }

  public pickColor(match: string): string {
    if (this.COVERED_WITH_QUOTES.test(match)) {
      return this.IS_KEY.test(match) ? '#000' : '#a11';
    } 
    
    if (this.IS_BOOLEAN.test(match)) {
        return'#219';
    }
    
    if (this.IS_NULL.test(match)) {
        return '#219';
    }

    return '#164';
  }

  public bytesCalculator(object: any, max?: number): Optional<number> {
    let objectList = [];
    let stack = [object];
    let bytes = 0;

    while (stack.length) {
      if (max && bytes > max) {
        return undefined;
      }
      
      const value = stack.pop();

      if (typeof value === 'boolean') {
        bytes += 4;
      } else if (typeof value === 'string') {
        bytes += value.length * 2;
      } else if (typeof value === 'number') {
        bytes += 8;
      } else if (typeof value === 'object' && value !== null) {
        if (objectList.indexOf(value) === -1) {
          objectList.push(value);

          for (const i in value) {
            if (value.hasOwnProperty(i)) {
              stack.push(value[i]);
            }
          }
        }
      }
    }
    return bytes;
  }

  public formatField(field: TableDataField) {
    switch (field.data_type.toLowerCase()) {
      case "byte":
        return this.formatBytes(field)
        case "timestamp":
          return this.formatTimestamp(field)
      default:
        return field.value;
    }
  }

  public formatBytes(field: TableDataField): string {
    let bytes = Number(field.value);

    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    if (Math.round(gb) > 0) {
        return `${gb.toFixed(2)} GB`;
    }
    if (Math.round(mb) > 0) {
        return `${mb.toFixed(2)} MB`;
    }
    if (Math.round(kb) > 0) {
        return `${kb.toFixed(2)} KB`;
    }

    return `${bytes.toFixed(2)} Bytes`;
  }

  public formatTimestamp(field: TableDataField): string {
    let timestamp = Date.now() - Number(field.value);
    if (isNaN(timestamp) ||timestamp < 0) {
        return field.value;
    }

    const days = Math.floor(timestamp / (24 * 60 * 60 * 1000));
    timestamp %= (24 * 60 * 60 * 1000);

    const hours = Math.floor(timestamp / (60 * 60 * 1000));
    timestamp %= (60 * 60 * 1000);

    const minutes = Math.floor(timestamp / (60 * 1000));

    const formattedDays = String(days).padStart(3, "0");
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedDays}:${formattedHours}:${formattedMinutes}`;
}

}