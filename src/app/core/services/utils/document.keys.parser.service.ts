import { Injectable } from '@angular/core';
import { WorkshopFormRequest } from '../../../interfaces/worksop.form.request';
import { Dict } from '../../../types/dict';
import { DocumentKey } from '../../../interfaces/server/document/document.key';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DocumentKeyAttribute } from '../../../interfaces/server/document/document.key.attribute';
import { DocumentSchema } from '../../../interfaces/server/document/document.schema';
import { DocumentDataParser } from '../../../interfaces/server/document/document.data.parsed';
import { FieldData } from '../../../interfaces/server/field/generate/field.data';

const KEY_FIELD_SEPARATOR: string = "%";
const KEYS_MULTIPLE_SEPARATOR: string = "%%";

@Injectable({
  providedIn: 'root'
})
export class DocumentKeysParserService {


  constructor() {}

  public static pathTitleParser(title: string): string {
    const result = DocumentKeysParserService._deserialize(title, {});
    return result.map(r => r.value).join("#");
  }

  public keysFromDocument(schema: DocumentSchema, document: DocumentDataParser): DocumentKey[]  {
    const fields = document.document;
    return schema.fields.filter(k => k.swkey).map(k => {
      return {
        name: k.value,
        value: this.mapField(k, fields[k.value]),
        json_type: k.json_type,
        attributes: k.attributes
      }
    });
  }

  public mapField(schema: FieldData, field: any): string  {
    const map = schema.attributes.filter(a => a.key == "$MAP");
    if(map.length == 0) {
      return this.stringifyField(field);
    }

    const fragments = map[0].value.split(".");
    let value: any = field;
    for (const fragment of fragments) {
      if(value == null || typeof value != 'object') {
        break;
      }
      value = value[fragment];
    }

    return this.stringifyField(value);
  }

  public stringifyField(field: any): string  {
    if(field !== null && typeof field === 'object' && Array.isArray(field)) {
      return JSON.stringify(field);
    }
    return field
  }

  public serialize(document: WorkshopFormRequest): {pathParam: string; queryParams: Dict<string>;} {
    let composePathParam: string = "";
    let composeQueryParams: Dict<string> = {};
    for (const composeKey of document.keys) {
      let {pathParam, queryParams} = this.serializeKey(composeKey);
      composePathParam = composePathParam == "" ? pathParam : `${composePathParam}${KEYS_MULTIPLE_SEPARATOR}${pathParam}`;
      composeQueryParams = {...composeQueryParams, ...queryParams};
    }

    return {pathParam: composePathParam, queryParams: composeQueryParams}
  }

  private serializeKey(request: DocumentKey): {pathParam: string; queryParams: Dict<string>;} {
    const pathParam = `${request.name}${KEY_FIELD_SEPARATOR}${request.json_type}${KEY_FIELD_SEPARATOR}${request.value}`;
    let queryParams: Dict<string> = {};
    for (const attribute of request.attributes) {
      const paramKey = `${request.name}${KEY_FIELD_SEPARATOR}${attribute.key}`;
      queryParams[paramKey] = attribute.value;
    }
    return {pathParam, queryParams};
  }

  public deserialize(snapshot: ActivatedRouteSnapshot): DocumentKey[] {
    const documents = snapshot.paramMap.get("document");
    if(!documents) {
      return [];
    }

    const attributesDict: Dict<DocumentKeyAttribute[]> = this.deserializeAttributes(snapshot);

    return DocumentKeysParserService._deserialize(documents, attributesDict);
  }

  private static _deserialize(documents: string, attributesDict: Dict<DocumentKeyAttribute[]>): DocumentKey[] {
    const keys: DocumentKey[] = [];
    for (const document of documents.split(KEYS_MULTIPLE_SEPARATOR)) {
      const [name, json_type, value] = document.split(KEY_FIELD_SEPARATOR);
      const attributes = attributesDict[name] ? attributesDict[name] : [];
      keys.push({
        name, value, json_type, attributes
      });
    }

    return keys;
  }

  private deserializeAttributes(snapshot: ActivatedRouteSnapshot): Dict<DocumentKeyAttribute[]> {
    const attributesDict: Dict<DocumentKeyAttribute[]> = {};
    for (const key of snapshot.queryParamMap.keys) {
      const [documentKey, argumentKey] = key.split(KEY_FIELD_SEPARATOR);
      if(!attributesDict[documentKey]) {
        attributesDict[documentKey] = [];
      }

      const documentArguments = attributesDict[documentKey];
      const value = snapshot.queryParamMap.get(key);
      documentArguments.push({
        key: argumentKey,
        value: value ? value : ""
      });
    }
    return attributesDict;
  }

}