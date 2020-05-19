import React from "react";
import { Route, Switch } from "react-router-dom";
// import CategoryTable from './category_table';
import LoginForm from "./login";
import AppliedRoute from "./AppliedRoute";
import NotFound from "./NotFound";
//import NotFound from "../containers/NotFound";
import BanksPage from "./BanksPage";
import Banks from "./Banks";
import Transactions from "./Transactions";
import Categories from "./Categories";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={LoginForm} appProps={appProps} />
      <AppliedRoute path="/banks" exact component={Banks} appProps={appProps} />
      <AppliedRoute
        path="/categories"
        exact
        component={Categories}
        appProps={appProps}
      />
      <AppliedRoute
        path="/transactions"
        exact
        component={Transactions}
        appProps={appProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
}
