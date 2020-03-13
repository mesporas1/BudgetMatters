self.addEventListener('push', function(event) {
  console.log(event.data.text())
  const getUncatTrans = fetch('/users/getUncategorizedTransactions',
    {
      method: 'POST',
      body: {username: event.data.text()}
    }).then(function(response){
      return response
    }).then(function(response){
      if (response.transactions.length() > 1){
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
      else if (response.transactions.length() == 1){
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
      case 'coffee-action':
        console.log('User ❤️️\'s coffee.');
        break;
      case 'doughnut-action':
        console.log('User ❤️️\'s doughnuts.');
        break;
      case 'gramophone-action':
        console.log('User ❤️️\'s music.');
        break;
      case 'atom-action':
        console.log('User ❤️️\'s science.');
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });

self.addEventListener('pushsubscriptionchange', function(event){
  console.log('Subscription changed');
  event.waitUntil(
    self.registration.pushManager
  )
})