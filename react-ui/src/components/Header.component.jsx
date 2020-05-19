import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Notification from "./Notification";

import { Link } from "react-router-dom";

const axios = require("axios");
axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  buttonStyles: {
    color: "white",
    margin: "0px 10px",
    textAlign: "center",
  },
  logoutStyles: {
    margin: "0px 10px",
  },
  notificationButton: {
    color: "white",
  },
  notificationContent: {
    padding: theme.spacing(2),
  },
}));

function Header({ handleLogout, userCreds }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          BudgetMatters
        </Typography>
        {userCreds.loggedIn ? (
          <>
            <IconButton
              aria-label="notification-setting"
              className={classes.notificationButton}
              onClick={handleNotificationClick}
            >
              <NotificationsIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <div className={classes.notificationContent}>
                <Notification className={classes.notificationContent} />
              </div>
            </Popover>
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
              Banks
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
  );
}

export default Header;
