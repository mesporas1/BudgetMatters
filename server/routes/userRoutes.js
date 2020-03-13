const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:userRoutes');
const mongodb = require('mongodb');
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const userRouter = express.Router();


function router(nav) {
  userRouter.route('/getBanks')
    .get((req, res, next) => {
      // Pull transactions for the Item for the last 30 days
      (async function getBanks() {
        try {
          const db = req.app.locals.db

          const col = db.collection('banks');

          const banks = await col.find(req.user.username).toArray();

          return res.json({ banks });
        } catch (err) {
          return res.json({err});
        }
      }());
    });
  userRouter.route('/getTransactions')
    .get((req, res, next) => {
      // Pull transactions for the Item for the last 30 days
      (async function getBanks() {
        try {
          const db = req.app.locals.db

          const col = db.collection('transactions');

          const transactions = await col.find(req.user.username).toArray();

          return res.json({ transactions });
        } catch (err) {
          return res.json({err});
        }
      }());
    });
  userRouter.route('/getTransactions')
    .get((req, res, next) => {
      // Pull transactions for the Item for the last 30 days
      (async function getBanks() {
        try {
          const db = req.app.locals.db

          const col = db.collection('transactions');

          const transactions = await col.find(req.user.username).toArray();

          return res.json({ transactions });
        } catch (err) {
          return res.json({err});
        }
      }());
    });
  userRouter.route('/getUncategorizedTransactions')
    .post((req, res, next) => {
      // Pull transactions for the Item for the last 30 days
      (async function getBanks() {
        try {
          const db = req.app.locals.db

          const col = db.collection('transactions');

          const transactions = await col.find({
            username: req.user.username,
            category: "None"
          }).toArray();

          return res.json({ transactions });
        } catch (err) {
          return res.json({err});
        }
      }());
    });   
  userRouter.route('/updateTransaction')
    .post((req, res, next) => {
      // Pull transactions for the Item for the last 30 days
      const { transactionId, category } = req.body;
      debug(transactionId);
      debug(category);
      (async function updateTransaction() {
        try {
          const db = req.app.locals.db

          const col = db.collection('transactions');
          const update = await col.updateOne(
            { transaction_id: transactionId },
            {
              $set: {'category': category}
            }
          );

          return res.sendStatus(200);
        } catch (err) {
          debug(err);
          return res.sendStatus(500);
        }
      }());
    });
  userRouter.route('/')
    .get((req, res) => {
      if (req.user) {
        res.json({ user: req.user });
      } else {
        res.json({ user: null });
      }
    });

  return userRouter;
}

module.exports = router;
