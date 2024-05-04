import { Routes } from '@angular/router';
import { ServicesComponent } from './pages/index/components/services/services.component';
import { DataBaseComponent } from './pages/index/components/data.base/data.base.component';

export const routes: Routes = [
    { path: '', redirectTo: '/services', pathMatch: 'full' },
    { path: 'services', component: ServicesComponent },
    { path: 'data-base/:id', component: DataBaseComponent }
];
