import React, { useEffect, useState,useContext } from 'react';
import { userContext } from "../../context/userContext";
import axios from 'axios';
import useForm from '../../hooks/useForm';
import validationRules from '../../validationRules/otpValidationRules';
import {motion} from 'framer-motion';
import styles from '../AuthForm/authForm.module.scss';

const TutorVerifyEmailForm= ({formType, setFormType})=> {
    const [registerationSuccess,setRegisterationSuccess]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const {setUser,setAlertMsg,userLoaded,setBannerMsg } = useContext(userContext);
    const [timmer,setTimmer]=useState(60000);

    useEffect(()=>{
        let timeOutFunc;
        if(timmer>0){
            timeOutFunc=window.setTimeout(()=>{
                setTimmer(prev=>prev-1000);
            },1000)
        }
        return(()=>{
            window.clearTimeout(timeOutFunc)
        })
    },[timmer,setTimmer]);
    useEffect(()=>{
        if(registerationSuccess){
            setFormType('tutorInfoForm');
            setBannerMsg({message:'OTP verified. Welcome to delta Educators'})
        }
    },[registerationSuccess])

    const sendMail=async ()=>{
        setIsLoading(true);
        setTimmer(60000);
        try{
            const config = {
                headers: {
                    'x-auth-token':localStorage.getItem("token")
                }
            };
            const res = await axios.get(`/api/auth/send-verification-email`,config);
            if(!res.data.error){
                setAlertMsg({message:'OTP sent successfully'});
            }
            else{
                setAlertMsg({message:res.data.error});
            }
        }
        catch(err){
            console.log(err);
            setBannerMsg({message:`Something went wrong!`});
        } 
        setIsLoading(false)
    }

    const registerationHandler =async () => {
            setIsLoading(true);
            const data={
                otp:values.otp
            }
            
            try{
                const config = {
                    headers: {
                        'x-auth-token':localStorage.getItem("token")
                    }
                };
                const res = await axios.post(`/api/auth/verify-email`,data,config);
                if(!res.data.error){
                    setRegisterationSuccess(true);
                }
                else {
                    setAlertMsg({message:res.data.error});
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
            } 
            setIsLoading(false) 
    }

    const { values, errors, handleChange, handleSubmit } = useForm(
        registerationHandler,
        validationRules
    );
    return (

      <React.Fragment>
        <motion.form initial={{opacity:0,x:-300}} animate={{opacity:1,x:0}} onSubmit={handleSubmit}>
            <h3>Verify you email</h3>
            <div className={styles.inputContainer}>
                <div className={styles.inputHolder}>
                    <label htmlFor='otp'>Enter OTP</label>
                        <input
                            type="number"
                            className={`${errors.otp? styles.validationError:styles.inputBox}`}
                            name="otp"
                            id="otp"
                            placeholder=""
                            value={values.otp || ""}
                            onChange={handleChange}
                        />
                    <div className={styles.errorMsg}>{errors.otp}</div>
                </div>
                <div className={styles.inputHolder}>
                    <input
                        type="submit"
                        className={`${styles.inputBox}`}
                        value={isLoading?`Loading...`:`Verify`}
                        disabled={isLoading}
                    />
                </div>
                <p>Didn't recieve OTP? 
                    {
                        timmer<=0?<span onClick={sendMail}>send again</span>
                        :
                        <span>Wait for {timmer/1000} seconds before requesting OTP again</span>
                    }
                </p>
            </div>
        </motion.form>
    </React.Fragment>
  );
}

export default TutorVerifyEmailForm;
