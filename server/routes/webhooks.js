const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:plaidLink');
const plaid = require('plaid');
const moment = require('moment');
const jwt = require('jsonwebtoken');
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

/*function verifyJWT(req){
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
    const claims = jwt.verify
      
    }*/
    

function router(nav) {
    webhookRouter.route('/transactions')
    .post((request, response, next) => {
      //console.log(request.body)
      //const JWK = verifyJWT(request)
      //jwt.verify

      const startDate = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      const { item_id } = request.body;
      const { new_transactions } = request.body;
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
                debug(error);
                //return response.json({
                 // error
               // });
              }
              debug(transactionsResponse.transactions);
              async function updateTransactions() {
                const transactions = db.collection('transactions')
                await transactions.insert(transactionsResponse.transactions)
              }
              updateTransactions()
              //return response.json({ error: null, transactions: transactionsResponse });

            }
          );
          response.sendStatus(200);
        } catch (err) {
          debug(err);
          response.sendStatus(500);
        }
      }());
    });
  return webhookRouter;
}

module.exports = router;