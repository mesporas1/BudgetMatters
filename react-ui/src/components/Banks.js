import React, {useState, useEffect, useCallback} from 'react';
import PlaidLink from 'react-plaid-link';
import '../App.css';
import Transactions from "./Transactions";
import Categories from "./Categories";
import NotButton from "./NotButton";
const axios = require('axios');

function Banks(props){
    
    
    const [banks, setBanks] = useState(<th> No bank data </th>);
    const [isFetching, setIsFetching] = useState(false);
  
    useEffect(() => {
      const fetchBanks = async () => {
            const result = await axios.get('/user/getBanks')
            setBanks(result.data.banks.map((function(bank){
            console.log(bank)
            return <tr key = {bank._id}><th>{bank.institution}</th></tr>
            })))
            setIsFetching(false)
      console.log('did you get the banks really though?')}
      fetchBanks()
    }, [isFetching]);

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
                setIsFetching(true)
            }
            get_token()
            console.log("did the banks work")
        }    catch (e) {
            console.log(e);
    }
    }

    
   
    return <div>
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
    <table>
        <tr>
            <th>Bank</th>
        </tr>
        { isFetching ? 'Fetching banks from API': banks   }

    </table>
    <Transactions></Transactions>
    <NotButton></NotButton>
    </div>
    
}

export default Banks;