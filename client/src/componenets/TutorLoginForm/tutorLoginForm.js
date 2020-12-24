import React, {useState,useContext,useEffect } from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import {userContext} from '../../context/userContext'
import useForm from '../../hooks/useForm';
import validationRules from '../../validationRules/loginFormValidationsRules';
import {motion} from 'framer-motion';
import styles from '../AuthForm/authForm.module.scss';

const TutorLoginForm= ({formType, setFormType,backUrl})=> {

    const [loginSuccess,setLoginSuccess]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const {setUser,setAlertMsg,userLoaded,setBannerMsg,user } = useContext(userContext);
    useEffect(()=>{
        if(userLoaded){
          localStorage.removeItem('token');
          setUser(null);
        }
        
    },[userLoaded]);

    useEffect(()=>{
        if(user){
            if(!user.isVerified){
                setAlertMsg({message:'Verify your email to proceed'})
                setFormType('tutorVerifyEmailForm')
            }
            else if(!user.isStepOneDone){
                setAlertMsg({message:'Complete registration to proceed'})
                setFormType('tutorInfoForm')
            }
            else if(!user.isStepTwoDone){
                setAlertMsg({message:'Complete registration to proceed'})
                setFormType('tutorFeeDetailForm');
            }
            else{
                setLoginSuccess(true)
            }
        }
    },[user,setFormType,setAlertMsg])

    const loginHandler = async () => {
        const data = {
          email: values.email,
          password: values.password
        };
        try{
            setIsLoading(true)
            let res= await axios.post(`${process.env.REACT_APP_API_URL}/teachers/login`, data)
            if (!res.data.error) {
                localStorage.setItem("token", res.data.result.token);
                setBannerMsg({message:`Welcome back ${res.data.result.user.name}`})
                setIsLoading(false);
                setUser(res.data.result.user);
            } 
            else {
                localStorage.removeItem("token");
                setUser(null);
                setAlertMsg({message:res.data.error});
                setIsLoading(false);
            }
        }
        catch(err){
            console.log(err)
            setBannerMsg({message:`Something went wrong!`});
            setIsLoading(false);
        }
    };
    const { values, errors, handleChange, handleSubmit } = useForm(
    loginHandler,
    validationRules
    );
    if(loginSuccess&&!isLoading){   
        return (<Redirect to={backUrl||'/'}/>)
    }
    return (
      <React.Fragment>
        <motion.form initial={{opacity:0,x:-300}} animate={{opacity:1,x:0}} onSubmit={handleSubmit}>
            <h3>Tutor Login</h3>
            <div className={styles.inputContainer}>
                
                <div className={styles.inputHolder}>
                    <label htmlFor='email'>Email</label>
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
                    <label htmlFor='password'>Password</label>
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
                        <input
                            type="submit"
                            className={`${styles.inputBox}`}
                            value={isLoading?`Loading...`:`Login`}
                            disabled={isLoading}

                        />
                </div>
                <p>New here? 
                    <span onClick={()=>{setFormType('tutorRegistration')}}>Register</span>
                </p>
            </div>
        </motion.form>
    </React.Fragment>
  );
}
export default TutorLoginForm;
