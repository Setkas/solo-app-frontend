import {Routes} from "@angular/router";
import {HomePage, LoginPage, NotFoundPage} from "../pages/";
import {AuthGuard} from "../guards";

export const Router: Routes = [
  {
    path: 'home',
    component: HomePage,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundPage
  }
];
