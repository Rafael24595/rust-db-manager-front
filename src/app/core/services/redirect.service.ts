import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WorkshopFormRequest } from '../../interfaces/worksop.form.request';
import { DocumentKeysParserService } from './utils/document.keys.parser.service';
import { Page } from '../../interfaces/page';
import { Dict } from '../../types/dict';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router: Router, private keyParser: DocumentKeysParserService) {
  }

  public goToHome(): void {
    this.router.navigate(["service"]);
  }

  public goToService(service: string): void {
    this.router.navigate(["/service", service]);
  }

  public goToDataBase(service: string, dataBase: string): void {
    this.router.navigate(["/service", service, "data-base", dataBase]);
  }

  public goToCollectionForm(service: string, dataBase: string): void {
    this.router.navigate(["/service", service, "data-base", dataBase, "new-collection"]);
  }

  public goToCollection(service: string, dataBase: string, collection: string, page?: Page): void {
    let queryParams: Dict<string> = {};
    if(page) {
      queryParams = {
        limit: `${page.limit}`
      }
    }
    this.router.navigate(["/service", service, "data-base", dataBase, "collection", collection], {queryParams});
  }

  public goToNewWorkshop(service: string, dataBase: string, collection: string): void {
    this.router.navigate(["/service", service, "data-base", dataBase, "collection", collection, "document", ""]);
  }

  public goToWorkshop(service: string, dataBase: string, collection: string, document: WorkshopFormRequest): void {
    const {pathParam, queryParams} = this.keyParser.serialize(document)
    this.router.navigate(["/service", service, "data-base", dataBase, "collection", collection, "document", pathParam], {queryParams});
  }

}
