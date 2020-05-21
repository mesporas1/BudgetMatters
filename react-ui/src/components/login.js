import React, { useState, useEffect } from "react";
import "../App.css";
import Transactions from "./Transactions";

import {
  makeStyles,
  Container,
  TextField,
  Avatar,
  Typography,
  Button,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

// eslint-disable-next-line
const axios = require("axios");
axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    margin: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

function LoginForm(props) {
  const classes = useStyles();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [responseText, setResponse] = useState({
    apiResponse: "Please log in",
  });
  useEffect(() => {
    if (props.userCreds.loggedIn) {
      setResponse({ apiResponse: "Logged in" });
    }
  }, [props.userCreds.loggedIn]);
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      axios
        .post("/auth/signin", {
          username: user,
          password: password,
        })
        .then(function (response) {
          setResponse({ apiResponse: "Log in successful!" });
          props.userHasAuthenticated({
            loggedIn: true,
            user: response.data.user.username,
          });
          console.log(response);
        })
        .catch(function (e) {
          alert("Failed to login: " + e.message);
        });
    } catch (e) {
      console.log(e);
      alert("Failed to login: " + e.message);
    }
  }

  function validateForm() {
    return user.length > 0 && password.length > 0;
  }

  return (
    <>
      {props.userCreds.loggedIn ? (
        <Transactions></Transactions>
      ) : (
        <Container className={classes.paper} maxWidth="xs">
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              margin="normal"
              required
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUser(e.target.value)}
            />
            <TextField
              id="pass"
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button
              className={classes.submitButton}
              type="submit"
              variant="contained"
              color="primary"
              disabled={!validateForm()}
            >
              Log in
            </Button>
          </form>
          <Typography>{responseText.apiResponse}</Typography>
        </Container>
      )}
    </>
  );
}

export default LoginForm;
