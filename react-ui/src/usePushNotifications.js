import {useState, useEffect} from "react";
import { checkIfPushSupported, registerServiceWorker, askPermission, subscribeUserToPush, sendSubscriptionToBackEnd, getUserSubscription } from './push-notifications';
import { register } from "./serviceWorker";

const pushNotificationSupported = checkIfPushSupported();

export default function usePushNotifications(){
    const [userConsent, setUserConsent] = useState(Notification.permission);
    // const [userSWReg, setUserSWReg] = useState(null);
     const [pushServerSubscription, setPushServerSubscription] = useState();
     const [error, setError] = useState(null);
     const [buttonText, setButtonText] = useState("Enable push notifications?")
     const [loading, setLoading] = useState(true);
 
     //Combined effect from react push notifications example.. hopefully it don't break xP
     useEffect(() => {
         console.log(pushNotificationSupported)
         console.log("hellooooooooooooooooooooooooooooooo")
         if (pushNotificationSupported) {
                 const regSW = async () => {
                    await registerServiceWorker()
                 }
                 regSW();
         };
     }, []); 
 
    useEffect(()=>{
         setError(false);
         const getExistingSub = async () => {
             const existingSub = await getUserSubscription();
             setPushServerSubscription(existingSub);
             sendSubscriptionToBackEnd(existingSub);
         }
         getExistingSub()
     }, [])
 
     const ask = async () => {
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
             })
             .catch(function(err){
             if (err !== "granted"){
                 setError({
                     name: "Consent denied",
                     message: "You denied the consent to receive notifications",
                     code: 0
                 })
                 }
             })
         }
     
 
     const subscribe = async () => {
         await subscribeUserToPush(pushServerSubscription).then(function(subscription){
             sendSubscriptionToBackEnd(subscription)
             setButtonText("Notifications enabled!")
         })
         .catch(err => {
             console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
         })
     };
     
     const onClickAskUserPermission = () => {
         ask();
     }

    return {
        onClickAskUserPermission,
        userConsent,
        pushNotificationSupported,
        pushServerSubscription,
        error,
        buttonText,
        loading
    }
}


