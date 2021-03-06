import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
 
import LandingPage from './components/view/LandingPage/LandingPage'
import LoginPage from './components/view/LoginPage/LoginPage'
import RegisterPage from './components/view/RegisterPage/RegisterPage'

function App() {
  return (
    <Router>
    <div>
      
     

      {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
      <Switch>
        <Route exact path="/">
          <LandingPage/>
        </Route>
        <Route exact path="/login" component={LoginPage} />
        
        <Route path="/RegisterPage">
          <RegisterPage  />
        </Route>
      </Switch>
    </div>
  </Router>
  );
}



export default App;
