self.addEventListener('push', function(event) {
  const title = 'Actions Notification';
  const options = {
    actions: [
      {
        action: 'coffee-action',
        title: 'Coffee',
        icon: '/images/demos/action-1-128x128.png'
      },
      {
        action: 'doughnut-action',
        title: 'Doughnut',
        icon: '/images/demos/action-2-128x128.png'
      },
      {
        action: 'gramophone-action',
        title: 'gramophone',
        icon: '/images/demos/action-3-128x128.png'
      },
      {
        action: 'atom-action',
        title: 'Atom',
        icon: '/images/demos/action-4-128x128.png'
      }
    ]
  };
  const promiseChain = self.registration.showNotification(title, options);

  event.waitUntil(promiseChain);
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