import { Component } from '@angular/core';
import { TableServicesComponent } from "./table.elements/table.elements.component";
import { TableDataComponent } from './table.data/table.data.component';

@Component({
    selector: 'app-services',
    standalone: true,
    templateUrl: './services.component.html',
    styleUrl: './services.component.css',
    imports: [TableServicesComponent, TableDataComponent]
})
export class ServicesComponent {

}