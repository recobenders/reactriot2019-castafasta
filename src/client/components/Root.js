import React from 'react';
import App from "./App";
import { Provider } from "react-redux";
import configureStore from "../store/configureStore";
import { CookiesProvider } from 'react-cookie';

const store = configureStore();

function Root() {
  return (
      <CookiesProvider>
        <Provider store={store}>
          <App/>
        </Provider>
      </CookiesProvider>
  );
}

export default Root;
