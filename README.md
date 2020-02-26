# Budget Matters

A budgeting application that retrieves and categorizes your transactions.

This was made using the MERN stack (MongoDb, Express, React, and Nodejs) and utilizes the Plaid API to pull transactions.
The structure is based off of https://github.com/mars/heroku-cra-node for deployment to Heroku

The only prerequisite for local development is to have node.js installed on your machine

To test in development run the following steps:
## Local Development

This is made up of two npm projects, so installation needs to be done both in the react-ui directory and the root directory.
I recommend installing from the react-ui directory before installing from the root dir.

```
# Front end installation
cd reaact-ui
npm install

# Back end installation
cd .. # Go to the root directory
npm install
```

After installation, open up two terminals and run ``` npm start ``` in both the react-ui directory and the root directory.

## Deployment

This application is deployed using Heroku.

If you choose to deploy this application, the config vars and MongoDb database need to be set up.
The specific env variables used in this are:
```
  PLAID_CLIENT_ID='your plaid client id'
  PLAID_PUBLIC_KEY='your plaid public key'
  PLAID_SECRET='your plaid secret key'
  PLAID_ENV=sandbox
  PLAID_COUNTRY_CODES=US,CA,GB,FR,ES
  PLAID_PRODUCTS=transactions
  MONGODB_URI='your mongodb uri'
```
After creating a Plaid account, the plaid api keys can be found at https://dashboard.plaid.com/account/keys

For mongodb, I used Heroku's mLab add-on. You could use any other mongodb resource that better suits your purposes.