// 1
import { ApolloClient, createNetworkInterface } from 'apollo-client';

// 2
const networkInterface = createNetworkInterface({
  uri: ' https://api.graph.cool/simple/v1/cj7hinwz504ao01273pjz29is'
});

// 3
const client = new ApolloClient({
  networkInterface
});

// 4
export function provideClient(): ApolloClient {
  return client;
}
