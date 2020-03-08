import React, {useState, useEffect} from 'react';
import '../App.css';
import Banks from "./Banks";
import '../push-notifications';
import { registerServiceWorker, askPermission, subscribeUserToPush, sendSubscriptionToBackEnd } from '../push-notifications';

// eslint-disable-next-line
const axios = require('axios');
axios.defaults.withCredentials = true;

function NotButton(props){
    const [notStatus, setStatus] = useState(false);
    const [password, setPassword] = useState('');
    registerServiceWorker
    askPermission
    subscribeUserToPush
    sendSubscriptionToBackEnd

    return  <button onClick={askPermission}>Enable notifications</button>
};

export default LoginForm;