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

function registerServiceWorker(){
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');
      
        navigator.serviceWorker.register('/sw.js')
        .then(function(reg) {
          console.log('Service Worker is registered', swReg);
      
          return reg;
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
          return null;
        });
      } else {
        console.warn('Push messaging is not supported');
        return null;
      }
    
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
    });
  }

//Subscribes the user to push notifications and returns a push subscription
// The pushSubscription needs to be JSON.stringfied
function subscribeUserToPush() {
    return getSWRegistration()
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
    return axios.post('/api/save-subscription/', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Bad status code from server.');
      }
  
      return response.json();
    })
    .then(function(responseData) {
      if (!(responseData.data && responseData.data.success)) {
        throw new Error('Bad response from server.');
      }
    });
  }

  export {
    registerServiceWorker,
    askPermission,
    subscribeUserToPush,
    sendSubscriptionToBackEnd
  }