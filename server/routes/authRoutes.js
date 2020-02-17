const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;

      (async function adduser() {
        try {
          const db = req.app.locals.db

          const col = db.collection('users');
          const user = { username, password };
          const results = await col.insertOne(user);
          debug(results);
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
        }
      }());
    });
  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'signIn',
      });
    })
    .post(passport.authenticate('local'),
      (req, res) => {
        res.send({ user: req.user });
      });
  authRouter.route('/logout')
    .post((req, res) => {
      if (req.user) {
        req.logout();
        res.send({ msg: 'logged out' });
      } else {
        res.send({ msg: 'no user to log out' });
      }
    });
  authRouter.route('/')
    /* .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    }) */
    .get((req, res) => {
      debug(res.data);
      debug(req.data);
      if (req.user) {
        debug(req.user);
        res.json({ user: req.user });
      } else {
        res.json({ user: null });
      }
    });

  return authRouter;
}

module.exports = router;
