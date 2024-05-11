import { Routes } from '@angular/router';
import { ServicesComponent } from './pages/index/components/services/services.component';
import { DataBaseComponent } from './pages/index/components/data.base/data.base.component';
import { CollectionComponent } from './pages/index/components/collection/collection.component';
import { CreateFormComponent } from './pages/index/components/collection/create.form/create.form.component';
import { DocumentComponent } from './pages/index/components/document/document.component';
import { WorkshopFormComponent } from './pages/index/components/document/workshop.form/workshop.form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/service', pathMatch: 'full' },
    { path: 'service', component: ServicesComponent },
    { path: 'service/:service', component: DataBaseComponent },
    { path: 'service/:service/data-base/:data_base', component: CollectionComponent },
    { path: 'service/:service/data-base/:data_base/new-collection', component: CreateFormComponent },
    { path: 'service/:service/data-base/:data_base/collection/:collection', component: DocumentComponent },
    { path: 'service/:service/data-base/:data_base/collection/:collection/document/:document', component: WorkshopFormComponent },
];