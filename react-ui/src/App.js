import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Routes from "./components/Routes";
const axios = require('axios');
axios.defaults.withCredentials = true;

function App(props) {
  const [userCreds, userHasAuthenticated] = useState({loggedIn: false, username: null});
  
  useEffect(() => {
    if (userCreds.loggedIn === false)
    {getUser();}
  },[userCreds.loggedIn])
  

  function handleLogout() {
    axios.post('/auth/logout').then(response =>{
      console.log(response.data)
      if (response.status === 200){
        userHasAuthenticated({loggedIn: false, username: null})
      }
    }).catch(error => {
      console.log('Logout error')
    })
  };


  async function getUser(){
    try{
    axios.get('/auth').then((response) => {
      console.log('Get user response: ');
      console.log(response);
      if (response.data.user){
        console.log('Get User: There is a use saved in the server session: ');
        userHasAuthenticated({loggedIn: true, username: response.data.user.username});
      } else{
        console.log('Get user: no user');
        userHasAuthenticated({loggedIn:false, username:null});
      }
    })} catch (e){
      console.log(e);
    }
  }

  return <div className="App container">
    { userCreds.loggedIn ? <div><Link to="/categories">Check Categories</Link> <Link to="/banks">Add banks</Link> <button onClick={handleLogout} type="button"> Logout</button>  </div>
      : <Link to="/">Login</Link>   
    }
          <Routes appProps={{ userCreds, userHasAuthenticated }} />
    </div>
  
}

export default App;