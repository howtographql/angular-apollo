import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {provideClient} from './apollo.config';
import {ApolloModule} from 'apollo-angular';
import {LinkListComponent} from './link-list/link-list.component';
import {LinkItemComponent} from './link-item/link-item.component';
import {CreateLinkComponent} from './create-link/create-link.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LinkListComponent,
    LinkItemComponent,
    CreateLinkComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ApolloModule.forRoot(provideClient)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
