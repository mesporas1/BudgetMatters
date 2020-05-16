import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  buttonStyles: {
    color: "white",
    margin: "0px 20px",
    textAlign: "center",
  },
  logoutStyles: {
    margin: "0px 10px",
  },
}));

function Header({ handleLogout, userCreds }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            BudgetMatters
          </Typography>
          {userCreds.loggedIn ? (
            <>
              <Button
                component={Link}
                to="/categories"
                variant="text"
                color="primary"
                className={classes.buttonStyles}
              >
                Check Categories
              </Button>
              <Button
                component={Link}
                to="/banks"
                variant="text"
                color="primary"
                className={classes.buttonStyles}
              >
                Add Banks
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                type="button"
                className={classes.logoutStyles}
              >
                Logout
              </Button>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
