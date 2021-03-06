export default (values,touched)=> {
    let errors = {};
    if(touched.email){
      if (!values.email) {
        errors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/i.test(values.email)) {
        errors.email = 'Email address is invalid';
      }
    }
    if ( touched.password&&!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };