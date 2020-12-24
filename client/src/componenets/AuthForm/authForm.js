import React, { useEffect, useState } from 'react';
import styles from './authForm.module.scss';
import StudentRegistrationorm from '../StudentRegistrationForm/studentRegistrationForm';
import StudentLoginForm from '../StudentLoginForm/studentLoginForm';
import StudentInfoForm from '../StudentInfoForm/studentInfoForm';
import TutorRegistrationForm from '../TutorRegistrationForm/tutorRegistrationForm';
import TutorInfoForm from '../TutorInfoForm/tutorInfoForm';
import TutorFeeDetailForm from '../tutorFeeDetailForm/tutorFeeDetailForm';
import TutorLoginForm from '../TutorLoginForm/tutorLoginForm';
import { useLocation } from 'react-router-dom';
import TutorVerifyEmailForm from '../TutorVerifyEmail/tutorVerifyEmail';
import StudentVerifyEmailForm from '../StudentVerifyEmail/studentVerifyEmail';
import { useElementScroll } from 'framer-motion';


const AuthForm= (props)=> {
    const location=useLocation();
    const [backUrl,setBackUrl]=useState();
    const [formType,setFormType]=useState(()=>{
        if(location.state){
            if(location.state.formType){
                return location.state.formType;
            }
            if(location.state.backUrl){
                setBackUrl(location.state.backUrl);
            }
        }else{
            setBackUrl('/')
        }
        return 'studentLogin';
    });
    useEffect(()=>{
    },[formType])
    const Form =(props)=>{
        if(props.formType==='tutorRegistration'){
            window.scrollTo(0, 0);
            return <TutorRegistrationForm  formType={props.formType} setFormType={setFormType}/>
        }
        else if(props.formType==='tutorLogin'){
            window.scrollTo(0, 0);
            return <TutorLoginForm  formType={props.formType} setFormType={setFormType} backUrl={backUrl}/>
        }
        else if(props.formType==='studentRegistration'){
            window.scrollTo(0, 0);
            return <StudentRegistrationorm  formType={props.formType} setFormType={setFormType} />
        }
        else if(props.formType==='studentLogin'){
            window.scrollTo(0, 0);
            return <StudentLoginForm  formType={props.formType} setFormType={setFormType} backUrl={backUrl}/>
        }
        else if(props.formType==='studentInfoForm'){
            window.scrollTo(0, 0);
            return <StudentInfoForm  formType={props.formType} setFormType={setFormType} backUrl={backUrl}/>
        }
        else if(props.formType==='tutorInfoForm'){
            window.scrollTo(0, 0);
            return <TutorInfoForm  formType={props.formType} setFormType={setFormType} />
        }
        else if(props.formType==='tutorFeeDetailForm'){
            window.scrollTo(0, 0);
            return <TutorFeeDetailForm formType={props.formType} setFormType={setFormType} backUrl={backUrl}/>
        }
        else if(props.formType==='tutorVerifyEmailForm'){
            window.scrollTo(0, 0);
            return <TutorVerifyEmailForm formType={props.formType} setFormType={setFormType}/>
        }
        else if(props.formType==='studentVerifyEmailForm'){
            window.scrollTo(0, 0);
            return <StudentVerifyEmailForm formType={props.formType} setFormType={setFormType}/>
        }
        else{
            return <></>
        }
    }
    const showStudentForm=()=>{
        if(formType==='studentRegistration'||formType==='tutorRegistration'){
            setFormType('studentRegistration')
        }
        else{
            setFormType('studentLogin')
        }
    }
    const showTutorForm=()=>{
        if(formType==='studentRegistration'||formType==='tutorRegistration'){
            setFormType('tutorRegistration');
        }
        else{
            setFormType('tutorLogin');
        }
    }
    return (
      <React.Fragment>
        <div className={styles.registerForm}>
            <div className={styles.imgContainer}></div>
            {(formType==='studentRegistration'||formType==='studentLogin'||formType==='tutorRegistration'||formType==='tutorLogin')&&
                <div className={styles.accountTypeHolder}>
                    <span 
                    className={formType==='studentRegistration'||formType==='studentLogin'?`${styles.accountType} ${styles.activeType}`:styles.accountType} 
                    onClick={showStudentForm}
                    >
                        Student
                    </span>
                    <span 
                    className={formType==='tutorRegistration'||formType==='tutorLogin'?`${styles.accountType} ${styles.activeType}`:styles.accountType} 
                    onClick={showTutorForm}
                    >
                        Tutor
                    </span>
                </div>
            }
            <div className={styles.formHolder}> 
                <Form formType={formType}/>
            </div>
        </div>
    </React.Fragment>
  );
}

export default AuthForm;