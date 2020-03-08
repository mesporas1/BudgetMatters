import {useState, useEffect} from "react";
import { registerServiceWorker, askPermission, subscribeUserToPush, sendSubscriptionToBackEnd } from '../push-notifications';

const pushNotificationSupported = 