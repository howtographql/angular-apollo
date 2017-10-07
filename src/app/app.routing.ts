import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LinkListComponent} from './link-list/link-list.component';
import {CreateLinkComponent} from './create-link/create-link.component';
import {LoginComponent} from './login/login.component';
// 1
import {SearchComponent} from './search/search.component';

/**
 * Setup all routes here
 */
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/new/1'
  },
  {
    path: 'new/:page',
    component: LinkListComponent,
    pathMatch: 'full'
  },
  {
    path: 'top',
    component: LinkListComponent,
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: CreateLinkComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
