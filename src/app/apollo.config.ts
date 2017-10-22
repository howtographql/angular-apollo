import {NgModule} from '@angular/core';
import {HttpClientModule, HttpHeaders} from '@angular/common/http';
import {GC_AUTH_TOKEN} from './constants';

// Apollo
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {SubscriptionClient} from 'subscriptions-transport-ws';

const uri = 'https://api.graph.cool/simple/v1/cj7hinwz504ao01273pjz29is';

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(apollo: Apollo,
              httpLink: HttpLink) {

    const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/cj7hinwz504ao01273pjz29is', {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem(GC_AUTH_TOKEN)
      }
    });

    const token = localStorage.getItem(GC_AUTH_TOKEN);
    const authorization = token ? `Bearer ${token}` : null;
    const headers = new HttpHeaders();
    headers.append('Authorization', authorization);

    // create Apollo
    apollo.create({
      link: httpLink.create({ uri, headers }),
      cache: new InMemoryCache()
    });
  }
}
