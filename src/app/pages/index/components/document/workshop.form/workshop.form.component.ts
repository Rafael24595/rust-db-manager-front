import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentKey } from '../../../../../interfaces/server/document/document.key';
import { DocumentKeysParserService } from '../../../../../core/services/utils/document.keys.parser.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { DocumentData } from '../../../../../interfaces/server/document/document.data';
import { AsyncPipe } from '@angular/common';
import { DbLogoService } from '../../../../../core/services/view/db.logo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-workshop-form',
  standalone: true,
  imports: [AsyncPipe, FormsModule, CodemirrorModule],
  templateUrl: './workshop.form.component.html',
  styleUrl: './workshop.form.component.css'
})
export class WorkshopFormComponent {

  @ViewChild('text_area') text_area!: ElementRef;

  documentData!: DocumentData;
  document!: string;
  error!: string;

  public service!: string;
  public dataBase!: string;
  public collection!: string;

  public keys!: DocumentKey[];

  options = {
    mode: "application/ld+json",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer, private route: ActivatedRoute, private logo: DbLogoService, private keyParser: DocumentKeysParserService, private resolver: RustDbManagerService) {
  }

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const oService = snapshot.paramMap.get("service");
    this.service = oService ? oService : "";
    const oDataBase = snapshot.paramMap.get("data_base");
    this.dataBase = oDataBase ? oDataBase : "";
    const oCollection = snapshot.paramMap.get("collection");
    this.collection = oCollection ? oCollection : "";

    this.keys = this.keyParser.deserialize(snapshot);

    this.resolver.collectionFind(this.service, this.dataBase, this.collection, this.keys).subscribe(
      documentData => {
        this.documentData = documentData;
        try {
          this.document = JSON.stringify(JSON.parse(documentData.document), null, 2);
        } catch (error) {
          this.document = documentData.document;
        }

        const title = `Editing document: ${this.documentTitle()}`;
        this.logo.set(title, this.service);
      }
    );
  }

  handleChange($event: Event): void {
    //console.log('ngModelChange', $event);
  }

  documentTitle() {
    if(!this.document) {
      return "";
    }

    if(this.documentData.base_key) {
      return this.documentData.base_key.value
    }

    return this.documentData.keys.map(k => k.value).join("#");
  }

}