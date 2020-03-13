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
        .then(function(reg) {
          console.log('Service Worker is registered', reg);
          reg.pushManager.subscribe({userVisibleOnly: true})
            /*.then(function(sub){
              console.log('endpoint', sub.endpoint)
              reg.active.postMessage(JSON.stringify({uid: uid, token: token}))
            })*/
          return reg;
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
        });      
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
function subscribeUserToPush() {
    return navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          process.env.REACT_APP_WP_PUBLIC_KEY
        )
      };
  
      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      return pushSubscription;
    });
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
    sendSubscriptionToBackEnd
  }