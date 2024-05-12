import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentKey } from '../../../../../interfaces/server/document/document.key';
import { DocumentKeysParserService } from '../../../../../core/services/utils/document.keys.parser.service';
import { RustDbManagerService } from '../../../../../core/services/rust.db.manager.service';
import { DocumentData } from '../../../../../interfaces/server/document/document.data';
import { AsyncPipe } from '@angular/common';
import { DbLogoService } from '../../../../../core/services/view/db.logo.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-workshop-form',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './workshop.form.component.html',
  styleUrl: './workshop.form.component.css'
})
export class WorkshopFormComponent {

  @ViewChild('text_area') text_area!: ElementRef;

  document!: DocumentData;
  error!: string;

  public service!: string;
  public dataBase!: string;
  public collection!: string;

  public keys!: DocumentKey[];

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
      document => {
        this.document = document;

        this.printDocumentFromData();

        const title = `Editing document: ${this.documentTitle()}`;
        this.logo.set(title, this.service);
      }
    );
  }

  ngAfterViewInit() {
    this.watchContent();
  }

  documentTitle() {
    if(!this.document) {
      return "";
    }

    if(this.document.base_key) {
      return this.document.base_key.value
    }

    return this.document.keys.map(k => k.value).join("#");
  }

  watchContent() {
    const childs = this.text_area.nativeElement.childNodes;
    if(childs.length == 0) {
        const li = this.renderer.createElement("li");
        li.classList.add("numbered-text-area-line")
        this.renderer.appendChild(this.text_area.nativeElement, li);
        return;
    }
    
    const document = this.getDocument();
    this.error = document.error;
  }

  printDocumentFromData() {
    const documentString = this.document.document;
    const document = this.valideDocument(documentString);
    this.error = document.error;

    const jsonString = document.error ? documentString : JSON.stringify(document.json, null, 2);

    this.printDocument(jsonString);
  }

  printDocumentFromPanel() {
    const document = this.getDocument();
    this.error = document.error;

    const jsonString = document.error ? this.text_area.nativeElement.innerText : JSON.stringify(document.json, null, 2);

    this.printDocument(jsonString);
  }

  printDocument(document: string) {
    this.cleanDocument();

    const result = document; //this.beautifyDocument(document);

    for (const line of result.split("\n")) {
      const li = this.renderer.createElement("li");
      li.classList.add("numbered-text-area-line");
      this.renderer.setProperty(li, 'innerHTML', line);
      this.renderer.appendChild(this.text_area.nativeElement, li);
    }
  }

  getDocument() {
    const document = this.text_area.nativeElement.innerText;
    if(document == "") {
      const json = {};
      const error = "";
      return {json, error};
    }
    return this.valideDocument(document);
  }

  valideDocument(document: string) {
    try {
      const json = JSON.parse(document);
      const error = "";
      return {json, error};
    } catch (e) {
      console.error("Invalid JSON string:", e);
      const json = {};
      const error = `${e}`;
      return {json, error};
    }
  }

  cleanDocument() {
    this.text_area.nativeElement.innerHTML = '';
  }

  beautifyDocument(document: string) {
    return document.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        let color = 'blue'; // Default color for keys
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                color = 'green'; // Key color
            } else {
                color = 'cyan'; // String value color
            }
        } else if (/true|false/.test(match)) {
            color = 'red'; // Boolean value color
        } else if (/null/.test(match)) {
            color = 'magenta'; // Null value color
        }
        return `<span class='color-${color}' style='color: ${color};'>${match}</span>`;
    });
}

}