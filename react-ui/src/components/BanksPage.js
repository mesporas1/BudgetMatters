import React from "react";
import { Grid, Typography } from "@material-ui/core";
import Banks from "./Banks";
import Transactions from "./Transactions";

const BanksPage = () => (
  <Grid container spacing={8}>
    <Grid item xs={12} sm={12} md={12} lg={3}>
      <Typography variant="h4">Banks</Typography>
      <Banks />
    </Grid>
    <Grid item xs={12} sm={12} md={12} lg={9}>
      <Typography variant="h4">Transactions</Typography>
      <Transactions></Transactions>
    </Grid>
  </Grid>
);

export default BanksPage;
