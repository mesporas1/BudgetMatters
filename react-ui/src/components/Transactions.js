import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
const axios = require('axios');

function Transactions(props){
    
    
    const [transactions, setTransactions] = useState(<th> No transaction data </th>);
    const [newTransaction, setNewTransaction] = useState(false)
    const [isFetching, setIsFetching] = useState(false);
  
    useEffect(() => {
      //setIsFetching(true);
      const fetchTransactions = async () => {
            setIsFetching(true)
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
    }, [newTransaction]);
    
    function addBank(token, metadata){
        console.log(token)
        console.log(metadata)
        try {
            const get_token = async () => {
                await axios.post('/plaid/get_access_token',{
                    public_token: token,
                    institution: metadata.institution.name
                    })
                    /*.then(() => {
                        const url = '/plaid/transactions/' + metadata.institution.name
                        return axios.get(url)
                    })
                    .then((response) => {
                        console.log('Response', response)
                    })*/
                setNewTransaction(true)
            }
            get_token()
            console.log("did the banks work")
        }    catch (e) {
            console.log(e);
    }
    }

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