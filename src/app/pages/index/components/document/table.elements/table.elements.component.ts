import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../../core/services/view/alert.service';
import { ResponseHandlerService } from '../../../../../core/services/response.handler.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComboSelectorComponent } from '../../../../../components/combo.selector/combo.selector.component';
import { DocumentDataParser } from '../../../../../interfaces/server/document/document.data.parsed';
import { RedirectService } from '../../../../../core/services/redirect.service';
import { WorkshopFormRequest } from '../../../../../interfaces/worksop.form.request';
import { ResponseException } from '../../../../../core/commons/response.exception';
import { Optional } from '../../../../../types/optional';
import { Dict } from '../../../../../types/dict';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { DocumentKey } from '../../../../../interfaces/server/document/document.key';
import { CollectionDataParsed } from '../../../../../interfaces/server/collection/collection.data copy';
import { Page } from '../../../../../interfaces/page';
import { FilterFormComponent } from '../filter.form/filter.form.component';
import { FilterElement } from '../../../../../interfaces/server/field/filter/filter.element';
import { FilterResources } from '../../../../../interfaces/server/field/filter/filter.resources';
import { CollectionData } from '../../../../../interfaces/server/collection/collection.data';

@Component({
  selector: 'app-table-elements',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ComboSelectorComponent, FilterFormComponent],
  templateUrl: './table.elements.component.html',
  styleUrl: './table.elements.component.css'
})
export class TableElementsComponent {

  @ViewChild(FilterFormComponent) 
  protected filterFormComponent!: FilterFormComponent;

  @Input() 
  public refreshBranch: Function;

  protected service!: string;
  protected dataBase!: string;
  protected collection!: string;

  protected documents: Optional<CollectionDataParsed>;
  protected details: boolean[];

  protected offset: number = 10;
  protected maxPages: number = 10;
  protected page: Page;

  protected filter!: FilterElement;

  public constructor(private route: ActivatedRoute, private sanitized: DomSanitizer, public utils: UtilsService, private redirect: RedirectService, private alert: AlertService, private handler: ResponseHandlerService, private resolver: RustDbManagerService) {
    this.refreshBranch = () => {};
    this.details = [];
    this.page = {
      title: "1",
      position: 0,
      limit: 0,
      offset: this.offset,
    };
    this.emptyFilter();
  }

  protected ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    const oCollection = snapshot.paramMap.get("collection");
    this.collection = oCollection ? oCollection : "";

    const query = snapshot.queryParamMap;
    const sLimit = query.get("limit");

    const position = sLimit ? Math.round(Number(sLimit) / this.offset) : 0;
    const limit = sLimit ? Number(sLimit) : 0;

    this.page = {
      title: `${position + 1}`,
      position: position,
      limit: limit,
      offset: this.offset
    }

    this.refreshData();
  }

  protected keyValue(document: DocumentDataParser): string {
    if(document.base_key) {
      return document.base_key?.value;
    }
    return document.keys.map(k => k.value).join(" - ");
  }

  protected fieldValue(field: string, document: DocumentDataParser): SafeHtml {
    if(this.utils.bytesCalculator(document.document[field], 100) == undefined) {
      return this.sanitized.bypassSecurityTrustHtml("File is too long.");
    }
    
    const stringify = JSON.stringify(document.document[field], null, 2);
    const beautify = this.utils.beautifyDocument(stringify);
    return this.sanitized.bypassSecurityTrustHtml(beautify);
  }

  protected documentKeys(document: DocumentDataParser): string[] {
    return Object.keys(document.document).sort();
  }

  public setFilter(filter: FilterElement): void {
    this.filter = filter;
    this.filterFormComponent.closeModal();
    this.refreshData();
  }

  public refreshData(): void {
    this._refreshData(this.page);
  }

  protected _refreshData(page: Page): void {
    if(this.filter) {
      this.refreshDataByFilter(page);
      return;
    }
    this.refreshDataByKey(page);
  }

  public refreshDataByFilter(page: Page): void  {  
    this.loadPage(page);
    this.resolver.documentQuery(this.service, this.dataBase, this.collection, this.filter, page.limit, page.offset).pipe(
      map(this.parseCollection.bind(this))
    ).subscribe();
  }

  public refreshDataByKey(page: Page): void  {  
    this.loadPage(page);
    this.resolver.documentFindAll(this.service, this.dataBase, this.collection, page.limit, page.offset).pipe(
      map(this.parseCollection.bind(this))
    ).subscribe();
  }

  private parseCollection(documents: CollectionData): void {
    this.details = Array.apply(null, Array(documents.documents.length)).map(() => false);
    const documentsParsed = documents.documents.map(document => {
      let parsed: Dict<any>;
      try {
        parsed = JSON.parse(document.document)
      } catch (error) {
        parsed = {};
      }
      
      const documentParsed: DocumentDataParser = {
        data_base: document.data_base,
        collection: document.collection,
        base_key: document.base_key,
        keys: document.keys,
        size: document.size,
        document: parsed
      }
      return documentParsed;
    });

    this.documents = {
      total: documents.total,
      limit: documents.limit,
      offset: documents.offset,
      documents: documentsParsed
    };

  }

  public loadPage(page: Page) {
    this.page = page;
    this.redirect.goToCollection(this.service, this.dataBase, this.collection, page);
  }

  protected openFormFilter() {
    this.filterFormComponent.openModal();
  }

  protected switchExpand(): void  {
    const direction = this.details.filter(d => d).length < this.details.length / 2;
    this.details = this.details.map(d => direction);
  }

  protected switchDetails(index: number): void  {
    this.details[index] = !this.details[index];
  }

  public openForm(): void  {
    this.redirect.goToNewWorkshop(this.service, this.dataBase, this.collection);
  }

  protected removeAll(): void  {
    const keys: DocumentKey[] = [];
    const title = "All";
    this._remove(keys, title);
  }

  protected remove(document: DocumentDataParser): void  {
    let keys = document.keys;
    let title = document.keys.map(k => k.value).join("#");
    if(document.base_key != undefined) {
      keys = [document.base_key];
      title = document.base_key.value
    }
    this._remove(keys, title);
  }

  private _remove(keys: DocumentKey[], title: string): void  {
    this.resolver.documentDelete(this.service, this.dataBase, this.collection, keys).subscribe({
      error: (e: ResponseException) => {
        if(this.handler.autentication(e, {
          key: "Document",
          name: title,
          service: this.service,
          nextCallback: {
            func: this.remove.bind(this),
            args: [document]
          }
        })) {
          return;
        }

        console.error(e);
        this.alert.alert(e.message);
      },
      complete: () => {
        this.alert.message(`Document '${title}' removed successfully.`);
        this.refreshData();
      }
    });
  }

  protected findPages(): Page[] {
    let length = 0;
    if(this.documents) {
      length = Math.round(this.documents.total / 10);
    }

    const middlePoint = Math.round(this.maxPages / 2);
    let sCursor = this.page.position - middlePoint;
    sCursor = sCursor < 0 ? this.page.position - (middlePoint + sCursor) : sCursor;

    let cursor = sCursor < 0 ? 0 : sCursor;

    const range = length - cursor;
    const pagesLength = range > this.maxPages ? this.maxPages : range;
    const pages: Page[] = Array(pagesLength + 2).fill(undefined);

    pages[0] = {
      title: `<<`,
      position: 0,
      limit: 0,
      offset: this.offset
    };

    pages[pages.length-1] = {
      title: `>>`,
      position: length - 1,
      limit: (length - 1) * this.offset,
      offset: this.offset
    }

    for (let index = 1; index < pages.length - 1; (index++, cursor++)) {
      pages[index] = {
        title: `${cursor + 1}`,
        position: cursor,
        limit: cursor * this.offset,
        offset: this.offset
      };
      
    }

    return pages;
  }

  protected load(document: DocumentDataParser): void {
    const request: WorkshopFormRequest = {
      base_key: document.base_key,
      keys: document.keys
    };
    this.redirect.goToWorkshop(this.service, this.dataBase, this.collection, request);
  }

  private emptyFilter(): void {
    this.resolver.resourcesFilter().subscribe((value: FilterResources) => {
      this.filter = {
        key: "",
        value: {
          category: value.root_category,
          value: "",
          attributes: [],
          children: []
        },
        direction: true,
        negation: false
      };
    });
  }

}