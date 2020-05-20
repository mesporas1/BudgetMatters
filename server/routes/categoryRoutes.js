const express = require("express");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:categoryRoutes");
const mongodb = require("mongodb");
if (process.env.NODE_ENV !== "production") require("dotenv").config();

const catRouter = express.Router();

function router(nav) {
  catRouter.route("/add").post((req, res) => {
    const { categoryName } = req.body;

    (async function addcategory() {
      try {
        const db = req.app.locals.db;

        const col = db.collection("categories");
        const category = { name: categoryName };
        const results = await col.insertOne(category);
        return res.json({ categoryName: category });
      } catch (err) {
        debug(err);
      }
    })();
  });
  catRouter.route("/getAll").get((req, res, next) => {
    // Pull transactions for the Item for the last 30 days
    (async function getAccessToken() {
      try {
        const db = req.app.locals.db;

        const col = db.collection("categories");

        const categories = await col.find().toArray();

        return res.json({ categories });
      } catch (err) {
        debug(err);
      }
    })();
  });
  catRouter.route("/remove").post((req, res, next) => {
    // Pull transactions for the Item for the last 30 days
    const { categoryId } = req.body;
    (async function getAccessToken() {
      try {
        const db = req.app.locals.db;

        const col = db.collection("categories");
        debug(categoryId);
        await col.deleteOne({ _id: new mongodb.ObjectID(categoryId) });
        const categories = await col.find().toArray();

        debug(categories);

        return res.json({ categories });
      } catch (err) {
        debug(err);
      }
    })();
  });
  catRouter.route("/").get((req, res) => {
    if (req.user) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  });

  return catRouter;
}

module.exports = router;
