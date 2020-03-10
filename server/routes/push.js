const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:push');
const webpush = require('web-push');
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const pushRouter = express.Router();    

function router(nav) {
    pushRouter.route('/save-subscription')
      .post((req, res, next) => {
        // Check if request is valid
        const isValidSaveRequest = (req, res) => {
            // Check the request body has at least an endpoint.
            if (!req.body || !req.body.endpoint) {
              // Not a valid subscription.
              res.status(400);
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({
                error: {
                  id: 'no-endpoint',
                  message: 'Subscription must have an endpoint.'
                }
              }));
              return false;
            }
            return true;
          };
        // Save subscription to database
        if (isValidSaveRequest){
            (async function saveSubscription() {
                try {
                    const db = req.app.locals.db
        
                    const col = db.collection('subscriptions');
                    const results = await col.insertOne(
                            {
                            "subscription":req.body,
                            "username":req.user.username
                            }
                        );
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ data: { success: true } }));
                } catch (err) {
                    debug("something is wrong 2")
                    debug(err);
                }
              }());
        }
        else {
            res.send(JSON.stringify( {error: {
                id: 'no-endpoint',
                message: 'Subscription must have an endpoint.'
              }
            }));
        }   
    });
  return pushRouter;
}

module.exports = router;