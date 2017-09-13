import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {provideClient} from './apollo.config';
import {ApolloModule} from 'apollo-angular';
import {LinkListComponent} from './link-list/link-list.component';
import {LinkItemComponent} from './link-item/link-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LinkListComponent,
    LinkItemComponent,
  ],
  imports: [
    BrowserModule,
    ApolloModule.forRoot(provideClient)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
