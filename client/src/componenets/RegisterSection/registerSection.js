import React,{useEffect,useContext} from "react";
import { Link } from "react-router-dom";
import Aos from 'aos';
import 'aos/dist/aos.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import styles from './registerSection.module.scss';
import {userContext} from '../../context/userContext'

export default () => {
  useEffect(()=>{
    Aos.init({duration:2000})
  },[])
  const {user}=useContext(userContext)
  return (
    <React.Fragment>
      {!user&&
        <div id="signinSection" className={styles.signinSection}>
              <div className={styles.studentSection}>
                  <div className={styles.content}>
                      <h2 className={styles.studentSecHead} data-aos='zoom-in'>Hire a tutor</h2>
                      <div className={styles.studentRegisterBtn}>
                          <Link data-aos='fade-up' to={
                            {
                              pathname:'/auth',
                              state:{
                              formType:'studentRegistration'
                              }
                            }
                          }>
                              Register 
                          </Link>
                      </div>
                      <div className={styles.alreadyRegisteredText} data-aos='fade-up'>Already Registered? <span>
                        <Link data-aos='fade-up' to={
                            {
                              pathname:'/auth',
                              state:{
                                formType:'studentLogin'
                              }
                            }
                        }>
                            Login
                        </Link>
                      </span></div>
                  </div>
              </div>
              <div className={styles.tutorSection}>
                  <div className={styles.content}>
                      <h2 className={styles.tutorSecHead} data-aos='zoom-in'>Become a tutor</h2>
                      <div className={styles.tutorRegisterBtn}>
                      <Link data-aos='fade-up' to={
                        {
                          pathname:'/auth',
                          state:{
                            formType:'tutorRegistration'
                          }
                        }
                      }>
                          Register 
                      </Link>
                      </div>
                      <div className={styles.alreadyRegisteredText}  data-aos='fade-up'>Already Registered? <span>
                        <Link data-aos='fade-up' to={
                          {
                            pathname:'/auth',
                            state:{
                              formType:'tutorLogin'
                            }
                          }
                        }>
                          Login
                        </Link>
                      </span></div>
                  </div>
              </div>
        </div>
      }
    </React.Fragment>
    
  );
};
