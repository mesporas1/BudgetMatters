const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { MongoClient } = require('mongodb');
const webpush = require('web-push');
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Logging.. i think..
  app.use(morgan('tiny'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({ secret: 'library',  resave: false, saveUninitialized: false, httpOnly:false, store: new MongoStore({ url: process.env.MONGODB_URI }) }));

  // DB stuff
  require('./config/passport.js')(app);
  
  // Connect to the database before starting the application server.
  MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

  // Save database object from the callback for reuse.
  db = client.db();
  debug("Database connection ready");
  app.locals.db = db;

  app.listen(PORT, () => {
    debug(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
  });
  const {
    WP_PUBLIC_KEY, WP_PRIVATE_KEY
  } = process.env;
  
  const mailto = 'mailto:' + process.env.WP_EMAIL
  webpush.setVapidDetails(
    mailto,
    WP_PUBLIC_KEY,
    WP_PRIVATE_KEY
  );
  
  const authRouter = require('./routes/authRoutes')();
  const plaidRouter = require('./routes/plaidLink')();
  const categoryRouter = require('./routes/categoryRoutes')();
  const userRouter = require('./routes/userRoutes')();
  const webhookRouter = require('./routes/webhooks')();
  const pushRouter = require('./routes/push')();

  app.use('/auth', authRouter);
  app.use('/plaid', plaidRouter);
  app.use('/category', categoryRouter);
  app.use('/user', userRouter);
  app.use('/webhooks', webhookRouter);
  app.use('/push', pushRouter);
  
  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  /*app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });*/
}
