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
  TablePagination,
  Paper,
} from "@material-ui/core";

const axios = require("axios");

const Transactions = (props) => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
          console.log({ resultCat });
          console.log({ resultTrans });
          setCategories(resultCat.data.categories);
          setTransactions(resultTrans.data.transactions);
        })
      );

      setIsFetching(false);
    };
    fetchTransactions();
  }, [isFetching]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Amount ($)</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching
              ? "Fetching transactions from API"
              : transactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell component="th" scope="row">
                        {transaction.name}
                      </TableCell>
                      <TableCell align="right">{transaction.amount}</TableCell>
                      <TableCell align="right">
                        <CategorySelection
                          id={transaction.transaction_id}
                          category={transaction.category}
                          categories={categories}
                        ></CategorySelection>
                      </TableCell>
                      <TableCell align="right">{transaction.date}</TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Transactions;
