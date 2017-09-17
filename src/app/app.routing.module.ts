import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// 1
import {LinkListComponent} from './link-list/link-list.component';
import {CreateLinkComponent} from './create-link/create-link.component';
import {LoginComponent} from './login/login.component';

/**
 * Setup all routes here
 */
const routes: Routes = [
  {
    path: '',
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
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [
    // 3
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
