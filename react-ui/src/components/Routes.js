import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginForm from "./login";
import NotFound from "./NotFound";
import Banks from "./Banks";
import Transactions from "./Transactions";
import Categories from "./Categories";
import UnauthenticatedRoute from "./Routes/UnauthenticatedRoute";
import AuthenticatedRoute from "./Routes/AuthenticatedRoute";

export default function Routes({ childProps }) {
  return (
    <Switch>
      <UnauthenticatedRoute
        path="/login"
        exact
        component={LoginForm}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/banks"
        exact
        component={Banks}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/categories"
        exact
        component={Categories}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/"
        exact
        component={Transactions}
        props={childProps}
      />
      <AuthenticatedRoute
        path="/transactions"
        exact
        component={Transactions}
        props={childProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
}
