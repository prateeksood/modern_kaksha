import { useState, useEffect } from 'react';

export default (callback, validate) => {

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  useEffect(() => {
      setErrors(validate(values,touched));
  }, [values,touched]);

  const handleSubmit = (event) => {
    event.persist();
    event.preventDefault(); 
    setIsSubmitting(true);
    for(let i=0;i<event.target.length;i++){
      setTouched(touched=>({...touched,[event.target[i].name]:true}));
    }
  };
  const clearAllValues = (event) => {
    setValues({});
    setTouched({});
    setIsSubmitting(false);
  };
  const clearValue = (controlName) => {
    setValues(values=>({...values,[controlName]:false}));
    setTouched(touched=>({...touched,[controlName]:false}));
    setIsSubmitting(false);
  };
  const markTouched = (controlName) => {
      setTouched(touched=>({...touched,[controlName]:true}));
  };
  const handleChange = (event) => {
    event.persist();
    setIsSubmitting(false);
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
    setTouched(touched=>({...touched,[event.target.name]:true}));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    markTouched,
    clearAllValues,
    setValues,
    clearValue
  }
};
