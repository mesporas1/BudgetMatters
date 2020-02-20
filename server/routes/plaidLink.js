const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:plaidLink');
const plaid = require('plaid');
const moment = require('moment');
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


function router(nav) {
  plaidRouter.use((req, res, next) => {
    if (req.user) {
      debug(req.user);
      next();
    } else {
      console.log('something went wrong redirect')
      res.redirect('/');
    }
  });

  plaidRouter.route('/')
    .get((req, res) => {
      const { username } = req.user;
      (async function mongo() {
        try {
          const db = request.app.locals.db

          const col = await db.collection('banks');

          const banks = await col.find().toArray();
          debug(banks);
          res.json({
            PLAID_PUBLIC_KEY,
            PLAID_ENV,
            PLAID_PRODUCTS,
            PLAID_COUNTRY_CODES,
            banks,
            username
          });
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  plaidRouter.route('/get_access_token')
    .post((request, response, next) => {
      const PUBLIC_TOKEN = request.body.public_token;
      debug(PUBLIC_TOKEN);
      client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
        if (error != null) {
          debug("something is wrong 1");
          debug(error);
          return response.json({ error });
        }
        const ACCESS_TOKEN = tokenResponse.access_token;
        const ITEM_ID = tokenResponse.item_id;
        const { institution } = request.body;
        // debug(institution);
        const { username } = request.user;
        debug("something is wrong 3")
        debug(request);
        (async function addItem() {
          try {
            const db = request.app.locals.db

            const col = db.collection('banks');
            const userItem = {
              username, ACCESS_TOKEN, ITEM_ID, institution
            };
            const results = await col.insertOne(userItem);
            // debug(results);
          } catch (err) {
            debug("something is wrong 2")
            debug(err);
          }
        }());

        // debug(tokenResponse);
        // debug('Item ID: $ITEM_ID');
        return response.json({
          access_token: ACCESS_TOKEN,
          item_id: ITEM_ID,
          error: null
        });
      });
    });

  // Retrieve Transactions for an Item
  // https://plaid.com/docs/#transactions
  plaidRouter.route('/transactions/:institution')
    .get((request, response, next) => {
      // Pull transactions for the Item for the last 30 days
      const { institution } = request.params;
      const startDate = moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      (async function getTransactions() {
        try {
          const db = request.app.locals.db

          const col = db.collection('banks');

          const bank = await col.findOne({ username: request.user.username, institution });
          // debug(results);

          client.getTransactions(
            bank.ACCESS_TOKEN,
            startDate,
            endDate,
            {
              count: 250,
              offset: 0
            },
            (error, transactionsResponse) => {
              if (error != null) {
                debug(error);
                return response.json({
                  error
                });
              }
              debug(transactionsResponse.transactions);
              //const transCol = db.collection('transactions')
              //await col.insert(transactionsResponse.transactions)
              return response.json({ error: null, transactions: transactionsResponse });
            }
          );
        } catch (err) {
          debug(err);
        }
      }());
    });

  plaidRouter.route('/set_access_token')
    .post((request, response, next) => {
      const ACCESS_TOKEN = request.body.access_token;
      client.getItem(ACCESS_TOKEN, (error, itemResponse) => {
        response.json({
          item_id: itemResponse.item.item_id,
          error: false
        });
      });
    });

  plaidRouter.route('/webhook/transactions')
    .post((request, response, next) => {
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
  return plaidRouter;
}

module.exports = router;
