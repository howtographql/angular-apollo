// 1
import {ApolloClient, createNetworkInterface} from 'apollo-client';
import {GC_AUTH_TOKEN} from './constants';

// 2
const networkInterface = createNetworkInterface({
  uri: ' https://api.graph.cool/simple/v1/cj7hinwz504ao01273pjz29is'
});

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

// 3
const client = new ApolloClient({
  networkInterface
});

// 4
export function provideClient(): ApolloClient {
  return client;
}
