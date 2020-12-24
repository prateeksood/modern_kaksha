import React, { useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserContextProvider from "./context/userContext";
import Header from './componenets/Header/header'
import Nav from './componenets/Nav/nav'
import HomePage from './componenets/HomePage/homePage';
import RegisterPage from './componenets/AuthPage/authPage';
import TutorInfoForm from './componenets/TutorInfoForm/tutorInfoForm';
import Footer from './componenets/Footer/footer';
import TutorFeeDetails from './componenets/tutorFeeDetailForm/tutorFeeDetailForm'
import ChoosePlanPage from './componenets/choosePlanPage/choosePlanPage';
import ProfilePage from './componenets/ProfilePage/ProfilePage';
import ConnectPage from './componenets/connectPage/connectPage'
import ErrorPage from './componenets/PageNotFoundErrorPage/pageNotFoundErrorPage'
import './App.module.scss'
import Loader from './componenets/Loader/loader';
import MsgBanner from './componenets/MsgBanner/msgBanner';
import ContactUsForm from './componenets/ContactUsForm/contactUsForm';

const App=()=> {
  const [isLoading,setIsLoading]=useState(true);
  useEffect(()=>{
    window.scrollTo(0, 1);
    window.setTimeout(()=>{
      setIsLoading(false)
    },1000)
  },[])
  return (
    <>
      {isLoading ?
        <div style={{'minHeight':'100vh','width':'100vw','position':'absolute','top':0,'bottom':0}}><Loader/></div>
    :
    <UserContextProvider>
      <Router>
        <Header/>
        <Nav/>
        <Switch>
            <Route exact path="/">
              <HomePage/>
            </Route>
            <Route exact path="/auth">
              <RegisterPage/>
            </Route>
            <Route exact path="/tutor-info">
              <TutorInfoForm/>
            </Route>
            <Route exact path="/tutor-fee">
              <TutorFeeDetails/>
            </Route>
            <Route exact path="/choose-plan">
              <ChoosePlanPage/>
            </Route>
            <Route path="/profile/:id">
              <ProfilePage/>
            </Route>
            <Route exact path="/connect">
              <ConnectPage/>
            </Route>
            <Route exact path="/contact-us">
              <ContactUsForm/>
            </Route>


            {/* =============================404========================== */}
            <Route >
              <ErrorPage/>
            </Route>
        </Switch>
        <MsgBanner/>
        <Footer/>
      </Router>
    </UserContextProvider>
  }
   </> 
  );
}

export default App;
