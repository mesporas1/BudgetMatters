import React, {useState, useEffect, useCallback} from 'react';
import PlaidLink from 'react-plaid-link';
import '../App.css';
const axios = require('axios');

function Banks(props){
    function handleSuccess(token, metadata){
        console.log(token)
        console.log(metadata)
        try {axios.post('/plaid/get_access_token',{
            public_token: token,
            institution: metadata.institution.name
            })
        }    catch (e) {
            console.log(e);
    }
    }
    
    const [banks, setBanks] = useState(<th> No bank data </th>);
    const [isFetching, setIsFetching] = useState(false);
    const [url, setUrl] = useState('/user/getBanks');
  
    const fetchBanks = useCallback(() => {
        axios.get(url)
        .then(response => {
            console.log(response.data)
                setBanks(response.data.banks.map((function(bank){
                    console.log(bank)
                    return <tr><th>{bank.institution}</th></tr>
                })))
                console.log('Got the banks')
                setIsFetching(false);
            })
        .catch(function(error){
            setBanks(<th>No banks added</th>)
            console.log("not able to get data")
            setIsFetching(false);
        }) 
    }, [url]);
  
    useEffect(() => {
      setIsFetching(true);
      fetchBanks();
    }, [fetchBanks]);

   
    return <div>
    publicKey={process.env.REACT_APP_PLAID_PRODUCTS}
    <PlaidLink 
    clientName="budgetting-app"
    env={process.env.REACT_APP_PLAID_ENV}
    product={process.env.REACT_APP_PLAID_PRODUCTS}
    publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
    onSuccess={handleSuccess}
    >
    Open Link and connect to your bank!
    </PlaidLink>

    <table>
        <tr>
            <th>Bank</th>
        </tr>
        { isFetching ? 'Fetching banks from API': banks}
    </table>

    </div>
    
}

export default Banks;