import React, { useEffect, useState,useContext } from 'react';
import { userContext } from "../../context/userContext";
import axios from 'axios';
import Loader from '../Loader/loader'
import useForm from '../../hooks/useForm';
import validationRules from '../../validationRules/registerationFormValidationRules';
import {motion} from 'framer-motion';
import styles from '../AuthForm/authForm.module.scss';

const TutorRegistrationForm= ({formType, setFormType})=> {
    const [registerationSuccess,setRegisterationSuccess]=useState(false);
    const[tncAgreed,setTncAgreed]=useState(false);
    const[tncValidatonErr,setTncValidationErr]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    const {setUser,setAlertMsg,userLoaded,setBannerMsg } = useContext(userContext);
    const[localErrors,setLocalErrors]=useState({});
    const [profilePic,setProfilePic]=useState();
    const [isFileBig,setIsFileBig]=useState(false);

    useEffect(()=>{
        if(userLoaded){
          localStorage.removeItem('token');
          setUser(null);
        }
    },[userLoaded]);

    useEffect(()=>{
        if(registerationSuccess){
            setFormType('tutorVerifyEmailForm')
        }
    },[registerationSuccess])

    const profilePicChangeHandler=(e)=>{
        setProfilePic(e.target.files[0]);
        setIsFileBig(false);
        if(e.target.files.length===0){
            setLocalErrors({profilePicture:'Profile picture is required'});
        }
        else{
            let fsize=e.target.files[0].size;
            const file = Math.round((fsize / 1024)); 
            if (e.target.files.length!==0&&file > 512) { 
                setIsFileBig(true)
                setLocalErrors({profilePicture:'Please select a file less than 500kb'});
                alert("File too Big, please select a file less than 500kb"); 
            }
            else{
                setLocalErrors({profilePicture:''});
            }
        }
    }

    const registerationHandler =async () => {
        if(tncAgreed&&!isFileBig){
            setIsLoading(true);
            setTncValidationErr(null);
            const formData=new FormData();
            formData.append('name',values.fullName);
            formData.append('email',values.email);
            formData.append('contactNumber',values.contactNumber);
            formData.append('password',values.password);
            formData.append('profilePicture',profilePic);
            
            try{
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                };
                const res = await axios.post(`/api/teachers/register`,formData,config);
                if(!res.data.error){
                    localStorage.setItem("token", res.data.result.token);
                    setUser(res.data.result.user);
                    setRegisterationSuccess(true);
                }
                else {
                    localStorage.removeItem("token");
                    setUser(null);
                    setAlertMsg({message:res.data.error});
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
            } 
            setIsLoading(false) 
        }
        else if(!tncAgreed){
            setTncValidationErr('Agree to terms and conditions to proceed');
        }
        else if(!profilePic){
            setLocalErrors({profilePicture:'Profile picture is required'});
        }
      };
    const { values, errors, handleChange, handleSubmit } = useForm(
        registerationHandler,
        validationRules
    );
    return (

      <React.Fragment>
        <motion.form initial={{opacity:0,x:-300}} animate={{opacity:1,x:0}} onSubmit={handleSubmit}>
            <h3>Tutor Registration</h3>
            <div className={styles.inputContainer}>
                <div className={styles.inputHolder}>
                    <label htmlFor='full-name'>Name*</label>
                    <input
                        type="text"
                        className={`${errors.fullName? styles.validationError:styles.inputBox}`}
                        name="fullName"
                        id="full-name"
                        placeholder=""
                        autoFocus
                        value={values.fullName || ""}
                        onChange={handleChange}
                    />
                    <div className={styles.errorMsg}>{errors.fullName}</div>
                </div>
                <div className={styles.inputHolder}>
                    <label htmlFor='email'>Email*</label>
                    <input
                        type="email"
                        className={`${errors.email? styles.validationError:styles.inputBox}`}
                        name="email"
                        id="email"
                        placeholder=""
                        value={values.email || ""}
                        onChange={handleChange}
                    />
                    <div className={styles.errorMsg}>{errors.email}</div>
                </div>
                <div className={styles.inputHolder}>
                    <label htmlFor='contact'>Contact Number*</label>
                        <input
                            type="number"
                            className={`${errors.contactNumber? styles.validationError:styles.inputBox}`}
                            name="contactNumber"
                            id="contact"
                            placeholder=""
                            value={values.contactNumber || ""}
                            onChange={handleChange}
                        />
                    <div className={styles.errorMsg}>{errors.contactNumber}</div>
                </div>
                <div className={styles.inputHolder}>
                    <label htmlFor='password'>Password*</label>
                        <input
                            type="password"
                            className={`${errors.password? styles.validationError:styles.inputBox}`}
                            name="password"
                            id="password"
                            placeholder=""
                            value={values.password || ""}
                            onChange={handleChange}
                        />
                    <div className={styles.errorMsg}>{errors.password}</div>
                </div>
                <div className={styles.inputHolder}>
                    <label htmlFor='confirm-password'>Confirm Password*</label>
                        <input
                            type="password"
                            className={`${errors.confirmPassword? styles.validationError:styles.inputBox}`}
                            name="confirmPassword"
                            id="confirm-password"
                            placeholder=""
                            value={values.confirmPassword || ""}
                            onChange={handleChange}
                        />
                    <div className={styles.errorMsg}>{errors.confirmPassword}</div>
                </div>
                <div className={styles.inputHolder}>
                    <label htmlFor='profilePicture'>Profile Picture (optional)</label>
                        <input
                            type="file"
                            className={`${styles.inputBox}`}
                            name="profilePicture"
                            id="profilePicture"
                            onChange={profilePicChangeHandler}
                            accept="image/*"
                        />
                        <div className={styles.errorMsg}>{localErrors.profilePicture}</div>
                </div>
                <div className={styles.checkboxHolder}>
                        <input
                            type="checkbox"
                            name="userTerms"
                            id="user-terms"
                            checked={tncAgreed}
                            onChange={()=>{
                                !tncAgreed&&setTncValidationErr(null)
                                setTncAgreed(prev=>!prev)
                            }}
                        />
                    <label htmlFor='user-terms'>I agree to <span>terms and conditions</span></label>
                </div>
                <div className={styles.errorMsg}>{tncValidatonErr}</div>
                <div className={styles.inputHolder}>
                        <input
                            type="submit"
                            className={`${styles.inputBox}`}
                            value={isLoading?`Loading...`:`Register`}
                            disabled={isLoading}
                        />
                </div>
                <p>Already registered? 
                    <span onClick={()=>{setFormType('tutorLogin')}}>Login</span>
                </p>
            </div>
        </motion.form>
    </React.Fragment>
  );
}

export default TutorRegistrationForm;
