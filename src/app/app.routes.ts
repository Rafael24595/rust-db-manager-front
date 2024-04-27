import { Routes } from '@angular/router';
import { ServicesComponent } from './pages/index/components/services/services.component';

export const routes: Routes = [
    { path: '', redirectTo: '/services', pathMatch: 'full' },
    { path: 'services', component: ServicesComponent },
];
