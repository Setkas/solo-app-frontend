import {Routes} from "@angular/router";
import {HomePage, LoginPage, NotFoundPage, RegisterPage, ForgotPage, SettingsPage, ClientPage} from "../pages/";
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
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'forgot',
    component: ForgotPage
  },
  {
    path: 'settings',
    component: SettingsPage,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'client',
    component: ClientPage,
    canActivate: [
      AuthGuard
    ]
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
