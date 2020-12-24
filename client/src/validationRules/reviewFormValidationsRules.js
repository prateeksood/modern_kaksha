export default (values,touched)=> {
    let errors = {};
    if(touched.reviewTitle){
      if (!values.reviewTitle) {
        errors.reviewTitle = 'Review title is required';
      } else if (values.reviewTitle.length>50) {
        errors.reviewTitle = 'Review title should be less than 50 letters';
      }
    }
    if ( touched.reviewBody&&!values.reviewBody) {
      errors.reviewBody = 'Review is required';
    }
    return errors;
  };