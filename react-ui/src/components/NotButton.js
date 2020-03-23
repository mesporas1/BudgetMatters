import React, {useState, useEffect} from 'react';
import '../App.css';
import Banks from "./Banks";
import usePushNotifications from '../usePushNotifications';
//import { checkIfPushSupported, registerServiceWorker, askPermission, subscribeUserToPush, sendSubscriptionToBackEnd, getUserSubscription } from '../push-notifications';

// eslint-disable-next-line
const axios = require('axios');
axios.defaults.withCredentials = true;
//const pushNotificationSupported = checkIfPushSupported();

function NotButton(props){
    const {
        onClickAskUserPermission,
        userConsent,
        pushNotificationSupported,
        error,
        buttonText,
        loading
    } = usePushNotifications();


    return <div>
        {error && (
            <section>
                <h2>{error.name}</h2>
                <p>Error message: {error.message}</p>
                <p>Error code: {error.code}</p>
            </section>
        )}
        <p>Push notifications are {!pushNotificationSupported && "NOT"} supported by your device</p>
        <p> User consent to receive notifications is <strong>{userConsent}</strong></p>
        <p>Push notifications allow you to view your new transactions</p>
        <p>Here is the error: {error}</p>
        <button disabled={userConsent == "granted"} onClick={onClickAskUserPermission}>{buttonText}</button>
        
    </div>
};

export default NotButton;