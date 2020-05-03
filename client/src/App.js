import React from "react";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import About from "./Pages/About";
import Home from "./Pages/Home";
import getCookie from "./utils/getCookie";
import socketIOClient from "socket.io-client";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cookieConsentShow: true,
      // make sure you edit this
      endpoint: "<add endpoint here>",
    };
  }
  componentDidMount() {
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // one year
    let existingCookie = getCookie("cookieConsent");
    if (existingCookie) {
      this.setState({ cookieConsentShow: false });
    }
  }

  hideCookieConsent = () => {
    this.setState({ cookieConsentShow: false });
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // one year
    document.cookie =
      "cookieConsent=true" + `;expires=${d.toUTCString()};path=/`;
  };

  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("weatherRequests", {});
  };

  render() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("weatherRequests", (requestsLeft) => {
      document.getElementById("request-count").innerText =
        "Weather queries left for today: " + requestsLeft;
    });

    return (
      <Router>
        <div
          className="App"
          style={{ position: "relative", minHeight: "100vh" }}
        >
          <Navbar />
          <span id="request-count"></span>

          <Switch>
            <Route
              exact
              path="/"
              component={() => (
                <Home
                  cookieConsentShow={this.state.cookieConsentShow}
                  sendRequest={this.send}
                />
              )}
            />
            <Route exact path="/about" component={About} />
          </Switch>
        </div>

        {this.state.cookieConsentShow && (
          <div id="cookie-banner" style={{ opacity: 0.8 }}>
            <div
              style={{
                textAlign: "center",
                padding: ".5rem 1.5rem",
              }}
            >
              This website uses cookies to improve users experience, by using it
              you agree to the use of cookies.{" "}
              <span
                className="close"
                style={{ color: "black" }}
                onClick={() => {
                  this.hideCookieConsent();
                }}
              />
            </div>
          </div>
        )}
      </Router>
    );
  }
}
