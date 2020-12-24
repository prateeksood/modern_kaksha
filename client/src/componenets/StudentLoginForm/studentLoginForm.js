import React,{useEffect,useState,useContext} from 'react';
import {Redirect, useHistory} from 'react-router-dom'
import axios from 'axios'
import {userContext} from '../../context/userContext'
import useForm from '../../hooks/useForm'
import validationRules from '../../validationRules/loginFormValidationsRules'
import {motion} from 'framer-motion'
import styles from '../AuthForm/authForm.module.scss'

const StudentLoginForm=({formType, setFormType,backUrl})=> {

    const [loginSuccess,setLoginSuccess]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const {setUser,setAlertMsg,userLoaded, setBannerMsg,user} = useContext(userContext);
    const history=useHistory();
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
                setFormType('studentVerifyEmailForm')
            }
            else if(!user.isStepOneDone){
                setAlertMsg({message:'Complete registration to proceed'})
                setFormType('studentInfoForm')
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
            let res= await axios.post(`${process.env.REACT_APP_API_URL}/students/login`, data)
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
        <motion.form initial={{opacity:0,x:-300}} animate={{opacity:1,x:0}} onSubmit={handleSubmit} autoComplete="off">
            <h3>Student Login</h3>
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
                            value={isLoading?`Loading...`:`Login`}
                            disabled={isLoading}
                        />
                </div>
                <p>New here? 
                    <span onClick={()=>{setFormType('studentRegistration')}}>Register</span>
                </p>
            </div>
        </motion.form>
    </React.Fragment>
  );
}
export default StudentLoginForm;