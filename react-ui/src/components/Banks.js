import React, {useState, useEffect} from 'react';
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
    let banks = <th>No banks</th>
    try {axios.get('/user/getBanks').then(response => {
        console.log(response.data)
            banks = response.data.banks.map((function(bank){
                console.log(bank)
                return <th>{bank.institution}</th>
            }))
            console.log('somethings going on 1')
        })}
    catch {
        banks = <th>No banks added</th>
        console.log('somethings going on 2')
    }
    
   
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
            <th> Bank Name</th>
        </tr>
        <tr>
            <th>{banks}</th>
        </tr>
    </table>

    </div>
    
}

export default Banks;