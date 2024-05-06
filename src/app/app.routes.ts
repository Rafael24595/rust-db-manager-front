import { Routes } from '@angular/router';
import { ServicesComponent } from './pages/index/components/services/services.component';
import { DataBaseComponent } from './pages/index/components/data.base/data.base.component';

export const routes: Routes = [
    { path: '', redirectTo: '/service', pathMatch: 'full' },
    { path: 'service', component: ServicesComponent },
    { path: 'service/:id', component: DataBaseComponent }
];