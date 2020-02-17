const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const { MONGODB_URI } = process.env;

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      (username, password, done) => {
        const url = MONGODB_URI;

        (async function mongo() {
          let client;
          try {
            client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
            debug('Conencted correctly to server');

            const db = client.db();
            const col = db.collection('users');

            const user = await col.findOne({ username });
            if (user === null) {
              done(null, false);
            } else if (user.password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (err) {
            debug(err);
          }
          client.close();
        }());
      }
    )
  );
};
