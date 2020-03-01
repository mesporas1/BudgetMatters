import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
const axios = require('axios');

function Transactions(props){
    
    
    const [transactions, setTransactions] = useState(<th> No transaction data </th>);
    const [isFetching, setIsFetching] = useState(false);
  
    useEffect(() => {
      //setIsFetching(true);
      const fetchTransactions = async () => {
            const result = await axios.get('/user/getTransactions')
            setTransactions(result.data.transactions.map((function(transaction){
            return <tr key = {transaction._id}>
                <th>{transaction.name}</th>
                <th>{transaction.amount}</th>
                <th>{transaction.category}</th>
                <th>{transaction.date}</th>
            </tr>
            })))
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