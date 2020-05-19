import React, { useState, useEffect, useCallback } from "react";
import PlaidLink from "react-plaid-link";

import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  banks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px",
  },
  banksTable: { margin: theme.spacing(2) },
  plaidLink: {},
}));

const Banks = (props) => {
  const classes = useStyles();
  const [banks, setBanks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      const result = await axios.get("/user/getBanks");
      setBanks(
        result.data.banks.map((bank) => {
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

  const addBank = (token, metadata) => {
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
  };

  return (
    <div className={classes.banks}>
      <TableContainer component={Paper} className={classes.banksTable}>
        <Table size="small">
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
      <PlaidLink
        className={classes.plaidLink}
        clientName="budgetting-app"
        env={process.env.REACT_APP_PLAID_ENV}
        product={process.env.REACT_APP_PLAID_PRODUCTS}
        publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
        onSuccess={addBank}
        webhook={process.env.REACT_APP_WEBHOOK}
      >
        Open Link and connect to your bank!
      </PlaidLink>
    </div>
  );
};

export default Banks;
