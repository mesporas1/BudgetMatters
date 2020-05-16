import React, { useState, useEffect } from "react";
import "./App.css";
import Routes from "./components/Routes";
import { useHistory } from "react-router-dom";

import { Grid, Container } from "@material-ui/core";
import Header from "./components/Header.component";

const axios = require("axios");
axios.defaults.withCredentials = true;

function App(props) {
  let history = useHistory();
  const [userCreds, userHasAuthenticated] = useState({
    loggedIn: false,
    username: null,
  });

  useEffect(() => {
    if (userCreds.loggedIn === false) {
      getUser();
    }
  }, [userCreds.loggedIn]);

  function handleLogout() {
    axios
      .post("/auth/logout")
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          userHasAuthenticated({ loggedIn: false, username: null });
          history.push("/");
        }
      })
      .catch((error) => {
        console.log("Logout error");
      });
  }

  async function getUser() {
    try {
      axios.get("/auth").then((response) => {
        console.log("Get user response: ");
        console.log(response);
        if (response.data.user) {
          console.log("Get User: There is a use saved in the server session: ");
          userHasAuthenticated({
            loggedIn: true,
            username: response.data.user.username,
          });
        } else {
          console.log("Get user: no user");
          userHasAuthenticated({ loggedIn: false, username: null });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Grid container direction="column" className="App">
      <Header handleLogout={handleLogout} userCreds={userCreds}></Header>
      <Container className="content-grid">
        <Routes appProps={{ userCreds, userHasAuthenticated }} />
      </Container>
    </Grid>
  );
}

export default App;
