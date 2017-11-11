import {NgModule} from '@angular/core';
import {HttpClientModule, HttpHeaders} from '@angular/common/http';
import {GC_AUTH_TOKEN} from './constants';
// Apollo
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {getOperationAST} from 'graphql';
import {WebSocketLink} from 'apollo-link-ws';


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

    const token = localStorage.getItem(GC_AUTH_TOKEN);
    const authorization = token ? `Bearer ${token}` : null;
    const headers = new HttpHeaders().append('Authorization', authorization);

    const uri = 'https://api.graph.cool/simple/v1/cj7hinwz504ao01273pjz29is';
    const http = httpLink.create({ uri, headers });

    const ws = new WebSocketLink({
      uri: `wss://subscriptions.graph.cool/v1/cj7hinwz504ao01273pjz29is`,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: localStorage.getItem(GC_AUTH_TOKEN),
        }
      }
    });


    // create Apollo
    apollo.create({
      link: ApolloLink.split(
        operation => {
          const operationAST = getOperationAST(operation.query, operation.operationName);
          return !!operationAST && operationAST.operation === 'subscription';
        },
        ws,
        http,
      ),
      cache: new InMemoryCache()
    });
  }
}
