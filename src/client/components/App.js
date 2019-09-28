import React, { Component } from "react";
import LandingPage from "./Pages/PC/LandingPage";
import MobilePage from "./Pages/Mobile/MobilePage";
import { WaitingPage as MobileWaitingPage } from "./Pages/Mobile/WaitingPage";
import { WaitingPage as PCWaitingPage } from "./Pages/PC/WaitingPage";

import socketIOClient from "socket.io-client";
import Constants from "../../shared/constants";
import { withCookies } from "react-cookie";
import { default as UUID } from "node-uuid";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    const { cookies } = props;

    let userId = cookies.get("user_id"); // Maybe do session_id instead

    if (userId === undefined) {
      userId = UUID.v4();
      cookies.set("user_id", userId);
    }

    this.state = {
      socket: socketIOClient("http://" + window.location.hostname + ":4001"),
      userId: userId
    };

    this.state.socket.on(Constants.MSG.GAME_JOINED, data =>
      console.log("Game Started")
    );
    this.state.socket.on(Constants.MSG.GAME_UPDATE, data =>
      console.log("Game Updated " + data.id)
    );
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <LandingPage
                  {...props}
                  socket={this.state.socket}
                  userId={this.state.userId}
                />
              )}
            />
            <Route
              exact
              path="/waiting"
              render={props => (
                <PCWaitingPage {...props} socket={this.state.socket} />
              )}
            />
            <Route
              path="/mobile/waiting"
              exact
              render={props => (
                <MobileWaitingPage {...props} socket={this.state.socket} />
              )}
            />
            <Route
              path="/mobile/:userId"
              render={props => (
                <MobilePage {...props} socket={this.state.socket} />
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withCookies(App);
