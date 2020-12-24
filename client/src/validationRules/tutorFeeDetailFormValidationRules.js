export default (values,touched)=> {
    let errors = {};
    
    if(touched.feeAmount){
      if (!values.feeAmount) {
        errors.feeAmount= 'Fee Amount is required';
      } 
    }
    if(touched.accountNumber){
      if (!values.accountNumber) {
        errors.accountNumber= 'Account Number is required';
      }  else if (!/^\d{9,18}$/.test(values.accountNumber)) {
        errors.accountNumber = 'Account Number is invalid';
      }
    }
    if(touched.confirmAccountNumber){
      if (!values.confirmAccountNumber) {
        errors.confirmAccountNumber= 'Account Number is required';
      }  
      else if (values.confirmAccountNumber!==values.accountNumber){
        errors.confirmAccountNumber = 'Account Numbers do not match';
      }
      else if (!/^\d{9,18}$/.test(values.confirmAccountNumber)) {
        errors.confirmAccountNumber = 'Account Number is invalid';
      }
      
    }
    if(touched.ifscCode){
      if (!values.ifscCode) {
        errors.ifscCode= 'IFSC code is required';
      }  else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(values.ifscCode)) {
        errors.ifscCode = 'IFSC code is invalid';
      }
    }
    if(touched.accountHolder){
      if (!values.accountHolder) {
        errors.accountHolder = 'Account holder\'s name is required';
      } else if (!/^([a-z']+( )?)+$/i.test(values.accountHolder)) {
        errors.accountHolder = 'Account holder\'s name can only contain alphabets and space';
      }
    }
    return errors;
  };
  