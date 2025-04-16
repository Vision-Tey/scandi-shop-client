// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://0.0.0.0:8000/public/graphql' }),
  cache: new InMemoryCache(),
});

export default client;
