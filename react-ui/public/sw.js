self.addEventListener('push', function(event) {
  console.log(event.data.text())
  console.log({username: event.data.text()})
  const getUncatTrans = fetch('/user/getUncategorizedTransactions',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: event.data.text()})
    }).then(function(response){
      console.log(response.json())
      return response.json()
    }).then(function(response){
      if (response.transactions.length > 1){
        const title = "You have new transactions! Would you like to categorize them?"
        const options = {
          actions:[
            {
              action: 'yes-action',
              title: 'Yes!'
            },
            {
              action: 'no-action',
              title: 'No..'
            }
          ]
        }
          return self.registration.showNotification(title, options)
        }
      else if (response.transactions.length == 1){
        const title = "You have one new transactions! Categorize? Otherwise, close notification/open site!"
        const options = {
          actions:[
            {
              action: 'food-action',
              title: 'Food!'
            },
            {
              action: 'gas-action',
              title: 'Gas!'
            }
          ]
        }
          return self.registration.showNotification(title, options)
      }
      })
    event.waitUntil(getUncatTrans)
  });
  
  self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
      // Was a normal notification click
      console.log('Notification Click.');
      return;
    }
  
    switch (event.action) {
      case 'yes-action':
        console.log('User wants a change.');
        break;
      case 'no-action':
        console.log('User does not want a change.');
        break;
      case 'food-action':
        console.log('User changed to food.');
        break;
      case 'gas-action':
        console.log('User changed to gas.');
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });

  self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('Subscription expired');
    event.waitUntil(
      self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(subscription) {
        console.log('Subscribed after expiration', subscription.endpoint);
        return fetch('/push/save-subscription', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: subscription
          })
        })
    )}
  );
