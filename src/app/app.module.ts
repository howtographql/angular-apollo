import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {provideClient} from './apollo.config';
import {ApolloModule} from 'apollo-angular';
import {LinkListComponent} from './link-list/link-list.component';
import {LinkItemComponent} from './link-item/link-item.component';
import {CreateLinkComponent} from './create-link/create-link.component';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from './app.routing';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth.service';
import {SearchComponent} from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    LinkListComponent,
    LinkItemComponent,
    CreateLinkComponent,
    HeaderComponent,
    LoginComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ApolloModule.forRoot(provideClient)
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
