import React from 'react';
import App from "./App";
import { Provider } from "react-redux";
import configureStore from "../store/configureStore";
import { CookiesProvider } from 'react-cookie';
import { createGlobalStyle } from "styled-components";
import fontUrl from "./Gingerbread House.ttf"
import fontUrl2 from "./HarryP.ttf"

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'OurFont';
    src: url('${fontUrl}') format('woff2');
    font-style: normal;
  }
  
  @font-face {
    font-family: 'HarryFont';
    src: url('${fontUrl2}') format('woff2');
    font-style: normal;
  }
`;

const store = configureStore();

function Root() {
  return (
      <CookiesProvider>
        <Provider store={store}>
            <GlobalStyles/>
          <App/>
        </Provider>
      </CookiesProvider>
  );
}

export default Root;
