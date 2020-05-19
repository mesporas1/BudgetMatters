import React, { useState, useEffect } from "react";
import "../App.css";
import { makeStyles, Button, Typography } from "@material-ui/core";
import usePushNotifications from "../usePushNotifications";
//import { checkIfPushSupported, registerServiceWorker, askPermission, subscribeUserToPush, sendSubscriptionToBackEnd, getUserSubscription } from '../push-notifications';

// eslint-disable-next-line
const axios = require("axios");
axios.defaults.withCredentials = true;
//const pushNotificationSupported = checkIfPushSupported();

const useStyles = makeStyles((theme) => ({
  notification: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

function Notification(props) {
  const classes = useStyles();
  const {
    onClickAskUserPermission,
    userConsent,
    pushNotificationSupported,
    error,
    buttonText,
    loading,
  } = usePushNotifications();

  return (
    <div className={classes.notification}>
      {error ? (
        <section>
          <Typography variant="h5">{error.name}</Typography>
          <Typography>Error message: {error.message}</Typography>
          <Typography>Error code: {error.code}</Typography>
          <br />
        </section>
      ) : null}
      <Typography>
        Push notifications are {!pushNotificationSupported && "NOT"} supported
        by your device.
      </Typography>
      <Typography>
        User consent to receive notifications is <strong>{userConsent}.</strong>
      </Typography>
      <Typography>
        Push notifications allow you to view your new transactions.
      </Typography>
      <Button
        className={classes.button}
        disabled={userConsent == "granted"}
        onClick={onClickAskUserPermission}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export default Notification;
