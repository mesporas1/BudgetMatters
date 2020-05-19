import React, { useState, useEffect, useCallback } from "react";
import PlaidLink from "react-plaid-link";
import "../App.css";
import Transactions from "./Transactions";
import Categories from "./Categories";
import NotButton from "./NotButton";

import {
  Grid,
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  banks: {
    //TODO,
  },
}));

function Banks(props) {
  const classes = useStyles();
  const [banks, setBanks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      const result = await axios.get("/user/getBanks");
      setBanks(
        result.data.banks.map(function (bank) {
          console.log(bank);
          return (
            <TableRow key={bank._id}>
              <TableCell component="th" scope="row">
                {bank.institution}
              </TableCell>
            </TableRow>
          );
        })
      );
      setIsFetching(false);
      console.log("did you get the banks really though?");
    };
    fetchBanks();
  }, [isFetching]);

  function addBank(token, metadata) {
    console.log(token);
    console.log(metadata);
    try {
      const get_token = async () => {
        await axios.post("/plaid/get_access_token", {
          public_token: token,
          institution: metadata.institution.name,
        });
        /*.then(() => {
                        const url = '/plaid/transactions/' + metadata.institution.name
                        return axios.get(url)
                    })
                    .then((response) => {
                        console.log('Response', response)
                    })*/
        setIsFetching(true);
      };
      get_token();
      console.log("did the banks work");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={12}>
        <Typography variant="h4">Banks</Typography>
      </Grid>
      <Grid item lg={12}>
        <PlaidLink
          clientName="budgetting-app"
          env={process.env.REACT_APP_PLAID_ENV}
          product={process.env.REACT_APP_PLAID_PRODUCTS}
          publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
          onSuccess={addBank}
          webhook={process.env.REACT_APP_WEBHOOK}
        >
          Open Link and connect to your bank!
        </PlaidLink>
      </Grid>

      <Grid item lg={3}>
        <TableContainer component={Paper} className={classes.banks}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Banks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetching ? "Fetching banks from API" : banks}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item lg={12}>
        <Typography variant="h4">Transactions</Typography>
      </Grid>
      <Grid item lg={12}>
        <Transactions></Transactions>
      </Grid>
      <Grid item lg={12}>
        <NotButton></NotButton>
      </Grid>
    </Grid>
  );
}

export default Banks;
