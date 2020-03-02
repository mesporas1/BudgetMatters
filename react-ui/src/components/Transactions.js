import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
import CategorySelection from './CategorySelection';
const axios = require('axios');

function Transactions(props){
    
    const [categories, setCategories] = useState(<th> No categories </th>);
    const [transactions, setTransactions] = useState(<th> No transaction data </th>);
    const [isFetching, setIsFetching] = useState(false);
  
    useEffect(() => {
      //setIsFetching(true);
      const fetchTransactions = async () => {
            function getTransactions(){
                return axios.get('/user/getTransactions');
            }
            function getCategories(){
                return axios.get('/category/getAll');
            }
            const result = await axios.all([getTransactions(), getCategories()])
                .then(axios.spread(function (resultTrans, resultCat){
                    console.log(resultCat)
                    setTransactions(resultTrans.data.transactions.map((function(transaction){
                        return <tr key = {transaction.transaction_id}>
                            <th>{transaction.name}</th>
                            <th>{transaction.amount}</th>
                            <th><CategorySelection id={transaction.transaction_id} category={transaction.category} categories={resultCat}></CategorySelection></th>
                            <th>{transaction.date}</th>
                        </tr>
                        })))
                }))
            
            setIsFetching(false)
      }
      fetchTransactions()
    }, [isFetching]);

    return <div>
    <table>
        <tr>
            <th>Transactions</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
        </tr>
        { isFetching ? 'Fetching transactions from API': transactions   }

    </table>

    </div>
    
}

export default Transactions;