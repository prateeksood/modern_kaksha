import React,{useEffect,useState,useContext} from 'react';
import {Helmet} from "react-helmet";
import axios from 'axios';
import { faEnvelope, faMapMarkedAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import {motion} from 'framer-motion'
import useForm from '../../hooks/useForm';
import validationRules from '../../validationRules/contactFormFormValidationsRules '
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {userContext} from '../../context/userContext';
import styles from './contactUsForm.module.scss'

const ContactUsForm=()=>{
    const [isLoading,setIsLoading]=useState(false);
    const {setBannerMsg}=useContext(userContext);
    const submitHandler = async () => {
        const data = {
          email: values.email,
          name: values.name,
          contactNumber:values.contactNumber,
          message:values.message
        };
        try{
            setIsLoading(true)
            let res= await axios.post(`${process.env.REACT_APP_API_URL}/messages`, data);
            if(res.status===200){
                console.log('Submited');
                setBannerMsg({message:`Thanks for contacting us will reach you soon`});
                clearAllValues();
            } 
        }
        catch(err){
            console.log(err)
            alert(err)
            setBannerMsg({message:`Something went wrong!`});
            setIsLoading(false);
        }
        finally{
            setIsLoading(false);
        }

    };
    const { values, errors, handleChange, handleSubmit,clearAllValues } = useForm(
        submitHandler,
        validationRules
    );

    return(
        <>
            <Helmet>
                <title>Contact Us | Feedback | Delta Educators</title>
                <meta
                    name="description"
                    content="Contact us if you have any feedback for Delta Educators."
                />
            </Helmet>
            <div className={styles.contactUsForm}>
                <h2>Contact Us</h2>
                <div className={styles.mainContainer}>
                    <motion.div className={styles.infoSection} initial={{opacity:0,x:-100}} animate={{opacity:1,x:0}}>
                        <div className={styles.infoHolder}>
                            <div className={styles.singleInfoContainer}>
                                <FontAwesomeIcon icon={faEnvelope}/>
                                <div>
                                    <div className={styles.infoHeader}>Email</div>
                                    <div className={styles.info}><a href="mailto:support@deltaeducators.com">support@deltaeducators.com</a></div>
                                </div>      
                            </div>

                            <div className={styles.singleInfoContainer}>
                                <FontAwesomeIcon icon={faPhone}/>
                                <div>
                                    <div className={styles.infoHeader}>Contact Number</div>
                                    <div className={styles.info}><a href="tel:+918628855283">+91-8628855283</a></div>
                                </div>
                            </div>

                            <div className={styles.singleInfoContainer}>
                                <FontAwesomeIcon icon={faMapMarkedAlt}/>
                                <div>
                                    <div className={styles.infoHeader}>Address</div>
                                    <div className={styles.info}>Building Number 108, top floor, Kamla Nagar, Crusher, Dhalli, Shimla, Himachal Pradesh (171006) </div>
                                </div>
                                
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className={styles.formHolder} initial={{opacity:0,x:100}} animate={{opacity:1,x:0}}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.inputHolder}>
                                    <label htmlFor='name'>Name</label>
                                    <input 
                                        type='text' 
                                        id='name' 
                                        name='name'
                                        className={`${errors.name&&styles.validationError}`} 
                                        value={values.name || ""}
                                        onChange={handleChange}
                                    />
                                    <div className={styles.errorMsg}>{errors.name}</div>
                            </div>
                            <div className={styles.inputHolder}>
                                    <label htmlFor='email'>Email</label>
                                    <input 
                                        type='email' 
                                        id='email' 
                                        name='email' 
                                        className={`${errors.email&&styles.validationError}`}
                                        value={values.email || ""}
                                        onChange={handleChange}    
                                    />
                                    <div className={styles.errorMsg}>{errors.email}</div>
                            </div>
                            <div className={styles.inputHolder}>
                                    <label htmlFor='contactNumber'>Contact Number</label>
                                    <input 
                                        type='number' 
                                        id='contactNumber' 
                                        name='contactNumber' 
                                        className={`${errors.contactNumber&&styles.validationError}`}
                                        value={values.contactNumber|| ""}
                                        onChange={handleChange}
                                    />
                                    <div className={styles.errorMsg}>{errors.contactNumber}</div>
                            </div>
                            <div className={styles.inputHolder}>
                                    <label htmlFor='message'>Your message</label>
                                    <textarea 
                                        name='message' 
                                        rows='10' id='message'
                                        className={`${errors.message&&styles.textAreaValidationError}`}
                                        value={values.message || ""}
                                        onChange={handleChange}    
                                    ></textarea>
                                    <div className={styles.errorMsg}>{errors.message}</div>
                            </div>
                            <div className={styles.inputHolder}>
                                    <input 
                                        type='submit' 
                                        id='submit' 
                                        value={isLoading?`Loading...`:`submit`}
                                        disabled={isLoading}    
                                    />
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default ContactUsForm;