import React, { Component } from "react";
import ErrorPage from "./Pages/ErrorPage";
import LandingPage from "./Pages/PC/LandingPage";
import MobilePage from "./Pages/Mobile/MobilePage";
import { WaitingPage as MobileWaitingPage } from "./Pages/Mobile/WaitingPage";
import { WaitingPage as PCWaitingPage } from "./Pages/PC/WaitingPage";
import { GamePage as MobileGamePage } from "./Pages/Mobile/GamePage";
import { GamePage as PCGamePage } from "./Pages/PC/GamePage";
import socketIOClient from "socket.io-client";
import Constants from "../../shared/constants";
import { withCookies } from "react-cookie";
import { default as UUID } from "node-uuid";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";

import "antd/dist/antd.css";
import { notification, Icon } from "antd";

const Wrapper = styled.section`
  height: 100vh;
  width: 100vw;
`;

class App extends Component {
  constructor(props) {
    super(props);
    const { cookies } = props;

    let userId = cookies.get("user_id"); // Maybe do session_id instead

    if (userId === undefined) {
      userId = UUID.v4();
      cookies.set("user_id", userId);
    }

    let socketClient = null;

    if (process.env.NODE_ENV === "production") {
      socketClient = socketIOClient();
    } else {
      socketClient = socketIOClient(window.location.hostname + ":4001");
    }

    this.state = {
      socket: socketClient,
      userId: userId
    };

    this.state.socket.on(Constants.MSG.ERROR, data => {
      this.setState({ error: data.message });
      const args = {
        message: "Something went wrong",
        description: `We are really sorry Young Cast-a Padawan, this mistake is on our side. Please go to landing page with browser and try to connect again. But Fast-a.`,
        icon: <Icon type="frown" style={{ color: "#108ee9" }} />,
        duration: 10
      };
      notification.error(args);
    });

    this.state.socket.on(Constants.MSG.WAITING_FOR_GAME, player => {
      this.setState({
        userId: player.id
      });
    });
  }

  render() {
    return (
      <Wrapper>
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
              path="/error"
              render={props => (
                <ErrorPage {...props} message={this.state.error} />
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
            <Route
              exact
              path="/game"
              render={props => (
                <PCGamePage
                  {...props}
                  socket={this.state.socket}
                  userId={this.state.userId}
                />
              )}
            />
            <Route
              exact
              path="/game/controller"
              render={props => (
                <MobileGamePage
                  {...props}
                  socket={this.state.socket}
                  userId={this.state.userId}
                />
              )}
            />
          </Switch>
        </Router>
      </Wrapper>
    );
  }
}

export default withCookies(App);
