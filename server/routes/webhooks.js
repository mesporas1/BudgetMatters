const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:webhooks');
const plaid = require('plaid');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const webpush = require('web-push');
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const webhookRouter = express.Router();
const {
  PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV, PLAID_PRODUCTS, PLAID_COUNTRY_CODES
} = process.env;

const KEY_CACHE = {}

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV],
    { version: '2019-05-29', clientApp: 'Plaid Quickstart' }
  );

function verifyJWT(req){
    
    signed_jwt = req.get('Plaid-Verification')
    current_key_id = jwt.decode(signed_jwt, {complete:true}).header.kid
    if (!(current_key_id in KEY_CACHE)){
        const keys_ids_to_update = Object.keys(KEY_CACHE).filter(key => 
            key['expired_at'] == null
          )
        keys_ids_to_update.append(current_key_id)
        
        for (const key in keys_ids_to_update){
          client.getWebhookVerificationKey(key, (err, result) => {
              if (err){
                  continue
              }
              KEY_CACHE.key = result.key
          })
        }
      }
    // If the key is not in the cache, it may be expired
    if (!(current_key_id in KEY_CACHE)){
      return false
    }

    // Fetch the current key from the cache
    key = KEY_CACHE[current_key_id];

    // Reject expired keys
    if (key['expired_at']){
      return false
    }

    // Validate the signature and etract the claims
    const claims = jwt.verify(signed_jwt, key, {algorithsm:['ES256']}, function(err, payload){
      if (err){
        return false
      }
    })
    
    //Ensure that the token is not expired
    if (claims["iat"] < Math.floor(Date.now() / 1000) - 5 * 60){
      return false
    }
    //Compute the hash of the body
    //Ensure that the hash of the body matches the claim.
    //Use constant time comparison to prevent timing attacks.
    const body_hash = crypto.createHash('sha256').update(req.body).digest('hex');
    return crypto.timingSafeEqual(body_hash, claims['request_body_sha256']);
  }

    

function router(nav) {
    webhookRouter.route('/transactions')
    .post((request, response, next) => {
      debug(request.body.webhook_code)
      switch (request.body.webhook_code) {
        case 'INITIAL_UPDATE':
          transactionUpdate(request, response)
          break;
        case 'DEFAULT_UPDATE':
          transactionUpdate(request, response)
          break;
        case 'HISTORICAL_UPDATE':
          return response.sendStatus(200);
        default:
          return response.sendStatus(200);
      }
    });
    webhookRouter.route('/test')
      .post((request, response, next) => {
        const { ACCESS_TOKEN } = request.body
        client.sandboxItemFireWebhook(ACCESS_TOKEN, 'DEFAULT_UPDATE', (err, fire_webhook_response) => {
          if (err != null) {
            debug('what');
            debug(err);
            return response.json({ err });
          }
          else{
            return response.json(fire_webhook_response);
          }
      });
    });
    webhookRouter.route('/testNot')
      .post((request, response, next) => {
        const {user} = request.body
        debug(user);
        sendNotification(user,request,response)
    });
  return webhookRouter;
}

function transactionUpdate(request,response){
      debug("WHATS GOING ON")
      const startDate = moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      const { item_id } = request.body; 
      const { new_transactions } = request.body;
      debug(new_transactions);
      if (new_transactions === 0){
        return response.sendStatus(200);
      }
      (async function getTransactions() {
        try {
          const db = request.app.locals.db

          const col = db.collection('banks');

          const bank = await col.findOne({ ITEM_ID: item_id});
          // debug(results);

          client.getTransactions(
            bank.ACCESS_TOKEN,
            startDate,
            endDate,
            {
              count: new_transactions,
              offset: 0
            },
            (error, transactionsResponse) => {
              if (error != null) {
                debug("this  is where plaid errors! 1")
                debug(error);
                return response.json({ error })
              }
              else{
                // debug(transactionsResponse.transactions);
                async function updateTransactions() {
                  const transactions = db.collection('transactions') 
                  parsedTransactions = transactionsResponse.transactions.map(transaction => {
                    const {transaction_id, account_id, amount, date, name} = transaction;
                    return {
                      transaction_id: transaction_id,
                      account_id: account_id, 
                      amount: amount,
                      date: date,
                      name: name,
                      category: "None",
                      username: bank.username
                    }
                  })
                  await transactions.insertMany(parsedTransactions)
                }
                updateTransactions()
              }
            }
          );
          debug(request.body.webhook_code);
          if (request.body.webhook_code == 'DEFAULT_UPDATE'){
            debug("sending notifications..");
            sendNotification(bank.username, request, response)
            return response.sendStatus(200);
          }
          else{
            return response.sendStatus(200);
          }        
        } catch (err) {
          debug(err);
          //response.sendStatus(500);
        }
      }());
    }

/*function getSubscriptions(user, req, res){
  (async function getSubscription(){
    try{
      const db = req.app.locals.db;

      const sub = db.collection('transactions')
      const userSubs = await sub.find({username: user}).toArray();
      return userSubs;
    } catch (err){
      return null;
    }
  }());
}*/


function sendNotification(user, req, res){
  (async function getSubscription() {
    try {
        const db = req.app.locals.db

        const sub = db.collection('subscriptions');
        const trans = db.collection('transactions');
        const userSub = await sub.find({username:user}).toArray();
        const userTrans = await trans.find({
          username: user,
          category: "None"
        }).toArray();
        debug(user)
        for (let i = 0; i < userSub.length; i++){
          webpush.sendNotification(userSub[i].subscription.body, user)
          .catch((err) => {
            debug(err.statusCode);
            debug(err);
            if (err.statusCode === 410){
              async function delSub(user){
                await sub.deleteOne({username:user})
              }
              delSub(user)
            }
            else {
              console.log('Subscription not valid', err);
            }
          })
        }
      } catch (err) {
      debug(err);
      return res.sendStatus(500);
    }
  }());
}

module.exports = router;