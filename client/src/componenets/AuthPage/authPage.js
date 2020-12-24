import {Helmet} from "react-helmet";
import React from "react";
import AuthForm from '../AuthForm/authForm'

export default ()=> {
  return (
    <div >
      <Helmet>
          <title>Register with Delta Educators | Login to your account|Delta Educators</title>
          <meta
              name="description"
              content="Register with Delta Educators to find quality teachers near you. Or start teaching with us, near you at your convinience. Sign up today or Login to your account. "
          />
      </Helmet>
      <AuthForm/>
    </div>
  );
}
