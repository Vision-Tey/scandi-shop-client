import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { StateProvider } from './context/StateProvider';
import reducer, { initialState } from './context/reducer';
import { ApolloProvider } from '@apollo/client';
import client from './api/apolloClient';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </ApolloProvider>
  </React.StrictMode>
);
