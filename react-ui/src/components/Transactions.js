import React, { useState, useEffect } from "react";

import { makeStyles, Typography } from "@material-ui/core";

import EnhancedTable from "./EnhancedTable/enhanced-table";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  transactions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    margin: theme.spacing(4),
    width: "80%",
  },
  noTransactions: {
    margin: theme.spacing(8),
  },
}));

const Transactions = (props) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const getTransactions = () => {
        return axios.get("/user/getTransactions");
      };
      const getCategories = () => {
        return axios.get("/category/getAll");
      };
      const result = await axios.all([getTransactions(), getCategories()]).then(
        axios.spread((resultTrans, resultCat) => {
          setCategories(resultCat.data.categories);
          setTransactions(resultTrans.data.transactions);
        })
      );

      setIsFetching(false);
    };
    fetchTransactions();
  }, [isFetching]);

  const headCells = [
    {
      id: "name",
      alignLeft: true,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "amount",
      alignLeft: false,
      disablePadding: false,
      label: "Amount ($)",
    },
    {
      id: "category",
      alignLeft: false,
      disablePadding: false,
      label: "Category",
    },
    { id: "date", alignLeft: false, disablePadding: false, label: "Date" },
  ];

  return (
    <div className={classes.transactions}>
      <Typography variant="h4">Transactions</Typography>
      {transactions ? (
        <EnhancedTable
          className={classes.table}
          headCells={headCells}
          rows={transactions}
          categories={categories}
        />
      ) : (
        <Typography className={classes.noTransactions}>
          There are no transactions. Please connect a bank.
        </Typography>
      )}
    </div>
  );
};

export default Transactions;
