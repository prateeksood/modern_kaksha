export default (values,touched)=> {
    let errors = {};
    if(touched.name){
      if (!values.name) {
        errors.name = 'Name is required';
      } else if (!/^([a-z']+( )?)+$/i.test(values.name)) {
        errors.name = 'Name can only contain alphabets and space';
      }
    }
    if(touched.email){
      if (!values.email && touched.email) {
        errors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/i.test(values.email)) {
        errors.email = 'Email address is invalid';
      }
    }
    if(touched.contactNumber){
      if (!values.contactNumber) {
        errors.contactNumber = 'Contact number is required';
      } else if (!/^[1-9]\d{9}$/.test(values.contactNumber)) {
        errors.contactNumber = 'Contact number is invalid';
      }
    }
    if(touched.message){
      if (!values.message) {
        errors.message = 'Message is required';
      } 
    }
    return errors;
  };