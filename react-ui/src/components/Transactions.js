import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import CategorySelection from "./CategorySelection";

import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

const axios = require("axios");

const Transactions = (props) => {
  const [categories, setCategories] = useState(<th> No categories </th>);
  const [transactions, setTransactions] = useState(
    <th> No transaction data </th>
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    //setIsFetching(true);
    const fetchTransactions = async () => {
      const getTransactions = () => {
        return axios.get("/user/getTransactions");
      };
      const getCategories = () => {
        return axios.get("/category/getAll");
      };
      const result = await axios.all([getTransactions(), getCategories()]).then(
        axios.spread((resultTrans, resultCat) => {
          console.log(resultCat);
          setTransactions(
            resultTrans.data.transactions.map((transaction) => {
              return (
                <TableRow key={transaction.transaction_id}>
                  <TableCell component="th" scope="row">
                    {transaction.name}
                  </TableCell>
                  <TableCell align="right">{transaction.amount}</TableCell>
                  <TableCell align="right">
                    <CategorySelection
                      id={transaction.transaction_id}
                      category={transaction.category}
                      categories={resultCat}
                    ></CategorySelection>
                  </TableCell>
                  <TableCell align="right">{transaction.date}</TableCell>
                </TableRow>
              );
            })
          );
        })
      );

      setIsFetching(false);
    };
    fetchTransactions();
  }, [isFetching]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Transactions</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isFetching ? "Fetching transactions from API" : transactions}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Transactions;
