export default (values,touched)=> {
    let errors = {};
    if(touched.aadhar){
      if(values.aadhar){
        if (!/^[2-9]{1}[0-9]{11}$/.test(values.aadhar)) {
          errors.aadhar = 'Aadhar number is invalid';
        }
      } 
    }
    if(touched.pincode){
      if (!values.pincode) {
        errors.pincode= 'Pincode is required';
      }  else if (!/^[1-8]{1}[0-9]{5}$/.test(values.pincode)) {
        errors.pincode = 'Pincode is invalid';
      }
    }
    if(touched.discription){
      if (values.discription) {
        if (values.discription.length>150) {
          errors.discription = 'discription should not exceed 150 letters';
        }
      } 
    }
    if(touched.instituteName){
      if (!values.instituteName) {
        errors.instituteName = 'Intitute name is required';
      } else if (!/^([a-z']+( )?)+$/i.test(values.instituteName)) {
        errors.instituteName = 'Institute name can only contain alphabets and space';
      }
    }
    if(touched.address){
      if (!values.address) {
        errors.address = 'Address is required';
      } 
    }

    return errors;
  };
  