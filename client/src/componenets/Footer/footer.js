import React,{useEffect} from "react";
import {Link} from 'react-router-dom';
import styles from './footer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Aos from 'aos';
import 'aos/dist/aos.css'

export default () => {
    useEffect(()=>{
        Aos.init({duration:2000})
      },[])
    
    return (
    <React.Fragment>
    <div className={styles.footer} > 
        <div className={styles.upperSection}>
            <div className={styles.footerAbout} data-aos='fade-in'>
                <h4>A little about Delta Educators</h4>
                <p>Quality tutors at affordable personalised prices are available anytime to fit your schedule. We cater to a wide array of subjects covering the extra curricular activities too.</p>
            </div>
            <div className={styles.footerAddress} data-aos='fade-in' data-aos-delay={200}>
                <h4>Locate Us</h4>
                <p>Building Number 108, top floor, Kamla Nagar, Crusher, Dhalli, Shimla, Himachal Pradesh (171006) </p>
            </div>
            <div className={styles.footerContact}  data-aos='fade-in' data-aos-delay={400}>
                <h4>Contact Us</h4>
                <ul>
                    <li><a href='mailto:support@deltaeducators.com'>support@deltaeducators.com</a></li>
                    <li><a href='tel:+918628855283'> +91-8628855283</a></li>
                </ul>
            </div>
            <div className={styles.footerQuickLinks}  data-aos='fade-in' data-aos-delay={600}>
                <h4>Quick Links</h4>
                <ul>
                    <li>
                        <Link to={{
                                pathname:'/connect',
                                state:{subjectList:['Mathematics']}
                            }}>
                                Mathematics
                        </Link>
                    </li>
                    <li>
                        <Link to={{
                                pathname:'/connect',
                                state:{subjectList:['Science']}
                            }}>
                                Science
                        </Link>
                    </li>
                    <li>
                        <Link to={{
                                pathname:'/connect',
                                state:{subjectList:['Guitar']}
                            }}>
                                Guitar
                        </Link>
                    </li>
                    <li>
                        <Link to={{
                                pathname:'/connect',
                                state:{subjectList:['Chess']}
                            }}>
                                Chess
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
        <div className={styles.lowerSection}>
             <FontAwesomeIcon icon={faCopyright}></FontAwesomeIcon> {(new Date).getFullYear()} | All rights reserved Sigma-Study
        </div>
        <div className={styles.developerDetails}>
             For website development contact <a href='mailto:prateeksood123@gmail.com'><FontAwesomeIcon icon={faEnvelope}/></a>
        </div>
    </div>
    </React.Fragment>
    
    );
};
