import React, {useState, useEffect} from 'react';
import '../App.css';
import Banks from "./Banks";
import usePushNotifications from '../usePushNotifications';

// eslint-disable-next-line
const axios = require('axios');
axios.defaults.withCredentials = true;

function NotButton(props){
    const {
        onClickAskUserPermission,
        userConsent,
        pushNotificationSupported,
        error,
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
        {loading && "Loading, please stand by"}
        <p>Push notifications are {!pushNotificationSupported && "NOT"} supported by your device</p>
        <p> User consent to receive notifications is <strong>{userConsent}</strong></p>
        <p>Push notifications allow you to view your new transactions</p>
        <button onClick={onClickAskUserPermission}> Enable push notifications? </button>
        
    </div>
};

export default NotButton;