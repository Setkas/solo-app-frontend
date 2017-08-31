import {Routes} from "@angular/router";
import {HomePage, NotFoundPage} from "../pages/";

export const Router: Routes = [
  {
    path: 'home',
    component: HomePage
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundPage
  }
];
