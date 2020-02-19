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
          debug(banks);

          return res.json({ banks });
        } catch (err) {
          return res.json({err});
        }
      }());
    });
  userRouter.route('/remove')
    .post((req, res, next) => {
      // Pull transactions for the Item for the last 30 days
      const { categoryId } = req.body;
      (async function getAccessToken() {
        try {
          const db = req.app.locals.db

          const col = db.collection('categories');
          debug(categoryId);
          await col.deleteOne({ _id: new mongodb.ObjectID(categoryId) });
          const categories = await col.find().toArray();

          debug(categories);

          res.render('categories', { categories });
        } catch (err) {
          debug(err);
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
