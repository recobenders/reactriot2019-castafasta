import React, { Component } from "react";
import LandingPage from "./Pages/LandingPage";
import socketIOClient from "socket.io-client";
import Constants from "../../shared/constants";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: socketIOClient("http://127.0.0.1:4001")
    };
    this.state.socket.on(Constants.MSG.GAME_JOINED, data =>
      console.log("Game Started")
    );
    this.state.socket.on(Constants.MSG.GAME_UPDATE, data =>
      console.log("Game Updated " + data.id)
    );
  }

  handleSocketTestClick() {
    this.state.socket.emit(Constants.MSG.NEW_PLAYER, "Test");
  }

  render() {
    return (
      <div>
        <LandingPage />
        <span onClick={this.handleSocketTestClick.bind(this)}>Socket test</span>
      </div>
    );
  }
}

export default App;
