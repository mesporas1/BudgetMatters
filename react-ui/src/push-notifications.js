const axios = require('axios');

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function checkIfPushSupported(){
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    return true;
  }
  else{
    return false;
  }
}

function registerServiceWorker(){
  return navigator.serviceWorker.register('/sw.js')
    .then(function(registration){
      console.log('Service worker registered');
      return registration
    })
    .catch(function(err){
      console.error('Unable to register service worker', err)
    })
  
     /*   .then(function(reg) {
          console.log('Service Worker is registered', reg);
         // reg.pushManager.subscribe({userVisibleOnly:true})
          reg.pushManager.getSubscription()
            .then(function(sub){
              console.log(sub);
              sendSubscriptionToBackEnd(sub);
              
              if (sub){
                console.log('user is subscribed')
              }
              else{
                console.log('user is not subscribed')
              }
              return sub
            })
            return reg;
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
        });      */
}

function askPermission() {
    return new Promise(function(resolve, reject) {
      const permissionResult = Notification.requestPermission(function(result) {
        resolve(result);
      });
  
      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
    .then(function(permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
      return permissionResult
    });
  }

//Subscribes the user to push notifications and returns a push subscription
// The pushSubscription needs to be JSON.stringfied
function subscribeUserToPush(registration) {
  return navigator.serviceWorker.register('/sw.js')
  .then(function(registration){
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        process.env.REACT_APP_WP_PUBLIC_KEY
      )
    };
    return registration.pushManager.subscribe(subscribeOptions)
  })
      .then(function(pushSubscription){
        console.log("test")
        return pushSubscription;
      })
  }

function getUserSubscription() {
    return navigator.serviceWorker.ready
      .then(function(serviceWorker){
        return serviceWorker.pushManager.getSubscription();
      })
      .then(function(pushSubscription){
        if (pushSubscription){
          return pushSubscription;
        } else{
          return subscribeUserToPush(pushSubscription)
        }
        
      })
  }

  //Sends subscription to server
function sendSubscriptionToBackEnd(subscription) {
    console.log(subscription);
    return axios.post('/push/save-subscription/', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: subscription
    }
    )
    .then(function(response) {
      console.log(response);
    })
    .catch(function(e){
      console.log(e);
    });
  }

  export {
    checkIfPushSupported,
    registerServiceWorker,
    askPermission,
    subscribeUserToPush,
    sendSubscriptionToBackEnd,
    getUserSubscription
  }