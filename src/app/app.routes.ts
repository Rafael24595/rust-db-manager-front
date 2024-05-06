import { Routes } from '@angular/router';
import { ServicesComponent } from './pages/index/components/services/services.component';
import { DataBaseComponent } from './pages/index/components/data.base/data.base.component';
import { CollectionComponent } from './pages/index/components/collection/collection.component';

export const routes: Routes = [
    { path: '', redirectTo: '/service', pathMatch: 'full' },
    { path: 'service', component: ServicesComponent },
    { path: 'service/:service', component: DataBaseComponent },
    { path: 'service/:service/:data_base', component: CollectionComponent }
];