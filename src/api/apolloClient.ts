// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://scanditestserver-nhst8lyo.b4a.run/public/graphql' }),
  cache: new InMemoryCache(),
});

export default client;
