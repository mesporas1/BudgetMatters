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

    return <PlaidLink 
    clientName="budgetting-app"
    env={process.env.REACT_APP_PLAID_ENV}
    product={process.env.REACT_APP_PLAID_PRODUCTS}
    publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
    onSuccess={handleSuccess}
    >
    Open Link and connect to your bank!
    </PlaidLink>
    
}

export default Banks;