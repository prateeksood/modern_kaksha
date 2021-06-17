import {Helmet} from "react-helmet";
import React from "react";
import AuthForm from '../AuthForm/authForm'

export default ()=> {
  return (
    <div >
      <Helmet>
          <title>Register with Modern Kaksha | Login to your account|Modern Kaksha</title>
          <meta
              name="description"
              content="Register with Modern Kaksha to find quality teachers near you. Or start teaching with us, near you at your convinience. Sign up today or Login to your account. "
          />
      </Helmet>
      <AuthForm/>
    </div>
  );
}
