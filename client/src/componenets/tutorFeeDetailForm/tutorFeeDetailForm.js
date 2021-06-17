import React,{useState,useContext,useEffect} from "react";
import {Redirect} from 'react-router-dom'
import { userContext } from "../../context/userContext";
import axios from 'axios'
import useForm from '../../hooks/useForm'
import validationRules from '../../validationRules/tutorFeeDetailFormValidationRules'
import {motion} from 'framer-motion';
import 'aos/dist/aos.css'
import styles from '../AuthForm/authForm.module.scss'

const TutorFeeDetailForm=({formType, setFormType,backUrl,isEditProfileForm})=> {
    const [isSubmited,setIsSubmited]=useState(false);
    const [feeDuration,setFeeDuration]=useState('monthly');
    const {setUser,setAlertMsg,userLoaded,user,setBannerMsg} = useContext(userContext);
    const [isLoading,setIsLoading]=useState(false);

    const changeFeeDuration=(e)=>{
        setFeeDuration(e.target.value);
    }
    const submitHandler =async () => {
        const data = {
            _id:user._id,
            feesPeriod:feeDuration,
            feeAmount: values.feeAmount,
            accountNumber:values.accountNumber,
            ifscCode:values.ifscCode,
            accountHolder:values.accountHolder,
            isStepTwoDone:true,
            isActive:true
        };
        try{
            setIsLoading(true);
            const res = await axios.put(`/api/teachers/update`,data,{headers:{'x-auth-token':localStorage.getItem("token")}});
            if(!res.data.error){
                setUser(res.data.result);
                setIsSubmited(true);
            }
            else {
                setAlertMsg({message:res.data.error});
            }
        }
        catch(err){
            console.log(err);
            setBannerMsg({message:`Something went wrong!`});
        } 
        setIsLoading(false);
    };
    const { values, errors, handleChange, handleSubmit,setValues} = useForm(
        submitHandler,
        validationRules
    );
    useEffect(()=>{
        if(user&&isEditProfileForm){
            setValues({...user})
            setFeeDuration(user.feesPeriod)
        }
    },[setValues,user,isEditProfileForm])
    if(isSubmited&&!isLoading){
        if(!isEditProfileForm){
            alert(`Thank You for completing your registration. As a token of gratitude we are giving you 5 free credits and we have posted a free ad for you.`)
        }
        return(<Redirect to={backUrl||'/connect'}/>)
    }
    return (
        <React.Fragment>
        
                <motion.form initial={{opacity:0,x:-300}} animate={{opacity:1,x:0}} onSubmit={handleSubmit} autoComplete="off">
                    <h3>{isEditProfileForm?'Edit Fee Details':'Fees Details'}</h3>
                    <div className={styles.inputContainer}>
                {/* ============================Fee Duration Radio============================= */}
                    <div className={styles.radioLabelHolder}><label htmlFor='feeDuration'>When would you like to collect the fees from Modern Kaksha? </label></div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="feeDuration"
                                id="weekly"
                                value="weekly"
                                checked={feeDuration==='weekly'}
                                onChange={changeFeeDuration}
                            />
                            <label htmlFor='weekly'>Weekly</label>
                        </div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="feeDuration"
                                id="monthly"
                                value="monthly"
                                checked={feeDuration==='monthly'}
                                onChange={changeFeeDuration}
                            />
                            <label htmlFor='monthly'>Monthly</label>
                        </div>
                {/* ===================================Fee Amount Textbox========================= */}
                        <div className={styles.inputHolder}>
                            <label htmlFor='feeAmount'>Per Class Fee Amount (INR)</label>
                            <input
                                type="number"
                                className={`${errors.feeAmount? styles.validationError:styles.inputBox}`}
                                name="feeAmount"
                                id="feeAmount"
                                placeholder=""
                                value={values.feeAmount || ""}
                                onChange={handleChange}
                            />
                            <div className={styles.errorMsg}>{errors.feeAmount}</div>
                        </div>

                {/* ===================================Account No. Textbox============================ */}
                        {/* <div className={styles.inputHolder}>
                            <label htmlFor='accountNumber'>Your Account Number</label>
                            <input
                                type="number"
                                className={`${errors.accountNumber? styles.validationError:styles.inputBox}`}
                                name="accountNumber"
                                id="accountNumber"
                                placeholder=""
                                value={values.accountNumber || ""}
                                onChange={handleChange}
                            />
                            <div className={styles.errorMsg}>{errors.accountNumber}</div>
                        </div> */}
                {/* ====================================Confirm Account textbox=========================== */}
                        {/* <div className={styles.inputHolder}>
                            <label htmlFor='confirmAccountNumber'>Confirm Account Number</label>
                            <input
                                type="number"
                                className={`${errors.confirmAccountNumber? styles.validationError:styles.inputBox}`}
                                name="confirmAccountNumber"
                                id="confirmAccountNumber"
                                placeholder=""
                                value={values.confirmAccountNumber || ""}
                                onChange={handleChange}
                            />
                            <div className={styles.errorMsg}>{errors.confirmAccountNumber}</div>
                        </div> */}
                {/* =====================================Ifsc textbox====================================== */}
                        {/* <div className={styles.inputHolder}>
                            <label htmlFor='ifscCode'>IFSC code</label>
                            <input
                                type="text"
                                className={`${errors.ifscCode? styles.validationError:styles.inputBox}`}
                                name="ifscCode"
                                id="ifscCode"
                                placeholder=""
                                value={values.ifscCode || ""}
                                onChange={handleChange}
                            />
                            <div className={styles.errorMsg}>{errors.ifscCode}</div>
                        </div> */}
                {/* ===================================Account Holder Name=================================== */}
                        {/* <div className={styles.inputHolder}>
                            <label htmlFor='accountHolder'>Account Holder's Name</label>
                            <input
                                type="text"
                                className={`${errors.accountHolder? styles.validationError:styles.inputBox}`}
                                name="accountHolder"
                                id="accountHolder"
                                placeholder=""
                                value={values.accountHolder || ""}
                                onChange={handleChange}
                            />
                            <div className={styles.errorMsg}>{errors.accountHolder}</div>
                        </div> */}
                
                        <div className={styles.inputHolder}>
                                <input
                                    type="submit"
                                    value={isLoading?`Loading...`:`Proceed`}
                                    disabled={isLoading}
                                />
                        </div>
                        
                    </div>
                </motion.form>
    </React.Fragment>
  );
}
export default TutorFeeDetailForm;
