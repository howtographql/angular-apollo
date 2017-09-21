import {ApolloClient, createNetworkInterface} from 'apollo-client';
import {GC_AUTH_TOKEN} from './constants';
import {addGraphQLSubscriptions, SubscriptionClient} from 'subscriptions-transport-ws';

const networkInterface = createNetworkInterface({
  uri: ' https://api.graph.cool/simple/v1/cj7hinwz504ao01273pjz29is'
});

const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/cj7hinwz504ao01273pjz29is', {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem(GC_AUTH_TOKEN)
  }
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = localStorage.getItem(GC_AUTH_TOKEN);
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

export function provideClient(): ApolloClient {
  return client;
}
