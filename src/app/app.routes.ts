import {provideRouter, Routes} from '@angular/router';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: '', component: ContactComponent },
 //{ path: '/contacts', component: ContactComponent },
];

export const appRouterProviders = [provideRouter(routes)];