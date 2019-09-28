import React from "react";
import logo from "./logo.svg";
import "./App.css";
import socketIOClient from "socket.io-client";
import Constants from "./shared/constants";

function App() {
  const socket = socketIOClient("http://127.0.0.1:4001");

  function handleSocketTestClick() {
    console.log("handle click");
    socket.emit(Constants.MSG.NEW_PLAYER, "test");
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn react
        </a>
        <span onClick={handleSocketTestClick}>Socket test</span>
      </header>
    </div>
  );
}

export default App;
