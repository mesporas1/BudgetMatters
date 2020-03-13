import {useState, useEffect} from "react";
import { checkIfPushSupported, registerServiceWorker, askPermission, subscribeUserToPush, sendSubscriptionToBackEnd } from './push-notifications';

const pushNotificationSupported = checkIfPushSupported();

export default function usePushNotifications(){
    const [userConsent, setUserConsent] = useState(Notification.permission);
    const [userSubscription, setUserSubscription] = useState(null);
    const [pushServerSubscription, setPushServerSubscription] = useState();
    const [error, setError] = useState(null);
    const [buttonText, setButtonText] = useState("Enable push notifications?")
    const [loading, setLoading] = useState(true);

    //Combined effect from react push notifications example.. hopefully it don't break xP
    useEffect(() => {
        if (pushNotificationSupported) {
            setLoading(true);
            setError(false);
            registerServiceWorker().then(() => {
                setLoading(false);
            })
        };
    }, []);

    const ask = async () => {
            setLoading(true);
            setError(false);
            await askPermission().then(consent => {
                setUserConsent(consent);
                if (consent !== "granted"){
                    setError({
                        name: "Consent denied",
                        message: "You denied the consent to receive notifications",
                        code: 0
                    })
                }
                subscribe();
            });
        }
    

    const subscribe = async () => {
        await subscribeUserToPush().then(function(subscription){
            setUserSubscription(subscription);
            sendSubscriptionToBackEnd(subscription)
            setButtonText("Notifications enabled!")
        })
        .catch(err => {
            console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
        })
        
        setLoading(false);
    };
    
    const onClickAskUserPermission = () => {
        ask();
    }

    return {
        onClickAskUserPermission,
        userConsent,
        pushNotificationSupported,
        userSubscription,
        error,
        buttonText,
        loading
    }
}


