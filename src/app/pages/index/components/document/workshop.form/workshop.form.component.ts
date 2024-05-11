import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentKey } from '../../../../../interfaces/server/document/document.key';
import { DocumentKeysParserService } from '../../../../../core/services/utils/document.keys.parser.service';

@Component({
  selector: 'app-workshop-form',
  standalone: true,
  imports: [],
  templateUrl: './workshop.form.component.html',
  styleUrl: './workshop.form.component.css'
})
export class WorkshopFormComponent {

  @ViewChild('text_area') text_area!: ElementRef;

  public service!: string;
  public dataBase!: string;
  public collection!: string;

  public keys!: DocumentKey[];

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private keyParser: DocumentKeysParserService) {
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
  }

  ngAfterViewInit() {
    this.watchContent();
  }

  watchContent() {
    const childs = this.text_area.nativeElement.childNodes;
    if(childs.length == 0) {
        const li = this.renderer.createElement("li");
        li.classList.add("numbered-text-area-line")
        this.renderer.appendChild(this.text_area.nativeElement, li);
    }
  }

}