import {Routes} from "@angular/router";
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  ForgotPage,
  SettingsPage,
  ClientPage,
  TeethPage,
  BleedPage
} from "../pages/";
import {AuthGuard, ClientGuard} from "../guards";

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
    path: 'teeth',
    component: TeethPage,
    canActivate: [
      AuthGuard,
      ClientGuard
    ]
  },
  {
    path: 'bleed',
    component: BleedPage,
    canActivate: [
      AuthGuard,
      ClientGuard
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
