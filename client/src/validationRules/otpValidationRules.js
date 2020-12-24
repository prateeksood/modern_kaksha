export default (values,touched)=> {
    let errors = {};
    if(touched.otp){
      if (!values.otp) {
        errors.otp = 'Please enter OTP';
      } else if (values.otp.length!==6) {
        errors.otp = 'OTP must be 6 digit long';
      }
    }
    return errors;
  };