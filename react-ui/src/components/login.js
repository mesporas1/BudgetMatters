import React, {useState, useEffect} from 'react';
import '../App.css';
import Banks from "./Banks";


// eslint-disable-next-line
const axios = require('axios');
axios.defaults.withCredentials = true;

function LoginForm(props){
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const [responseText, setResponse] = useState({apiResponse: 'Please log in'});
    useEffect(() => {
        if (props.userCreds.loggedIn){
            setResponse({apiResponse: 'Logged in'});
        }
    }, [props.userCreds.loggedIn])
    async function handleSubmit(event) {
        event.preventDefault();
      
        try {
        axios.post('/auth/signin',{
                username: user,
                password: password
                })
                .then(function(response){
                    setResponse({apiResponse: "Log in successful!"});
                    props.userHasAuthenticated({loggedIn: true, user: response.data.user.username});
                    console.log(response)
                })
                .catch(function(e){
                    alert('Failed to login: ' + e.message)
                })
            }    catch (e) {
                console.log(e);
            alert('Failed to login: ' + e.message);
        }
    }

    function validateForm() {
        return user.length > 0 && password.length > 0;
      }

    return  <div> {props.userCreds.loggedIn ? 
    <div> <Banks></Banks>  </div> :
        <div> <form onSubmit={handleSubmit}>
        <label for="username">Username: </label>
        <input id="username" onChange={e => setUser(e.target.value)} value={user}></input>
        <label for="pass">Password: </label>
        <input id="pass" type="password" onChange={e => setPassword(e.target.value)} value={password}></input>
        <button type="submit" disabled={!validateForm()}> Log in</button>
    </form>        
    <p>{responseText.apiResponse}</p> </div> 
     } </div>
};

export default LoginForm;