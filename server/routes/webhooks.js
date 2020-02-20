const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:plaidLink');
const plaid = require('plaid');
const moment = require('moment');
//const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const plaidRouter = express.Router();
const {
  PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV, PLAID_PRODUCTS, PLAID_COUNTRY_CODES
} = process.env;

const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV],
    { version: '2019-05-29', clientApp: 'Plaid Quickstart' }
  );

/*function verifyJWT(req){
    signed_jwt = req.header('Plaid-Verification')
    current_key_id = jwt.decode(signed_jwt)
}*/


function router(nav) {
    webhookRouter.route('/transactions')
    .post((request, response, next) => {
      debug(request)
      const startDate = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      const {item_id} = request.body
      const {new_transactions} = request.body
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
        } catch (err) {
          debug(err);
        }
      }());
    });
  return webhookRouter;
}

module.exports = router;