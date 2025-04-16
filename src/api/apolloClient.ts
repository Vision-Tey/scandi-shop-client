// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://bbf9-41-210-155-166.ngrok-free.app/public/graphql' }),
  cache: new InMemoryCache(),
});

export default client;
