import React,{useContext} from "react";
import {motion} from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-scroll';
import styles from './slidder.module.scss';
import sliderImg from '../../resources/images/teacher-bg-1.jpg';
import mobileBg from '../../resources/images/mobile-bg.jpg';
import {userContext }from '../../context/userContext'

export default () => {
  const {user}=useContext(userContext)
  return (
    <React.Fragment>
      
      <div className={styles.sliderContainer}>
          <img className={styles.background} src={sliderImg}/>
          <img className={styles.mobileBackground} src={mobileBg}/>
          <div className={styles.sliderContent}>
            <motion.h1 className={styles.tagline} initial={{opacity:0,x:-50}} animate={{opacity:1, x:0}} transition={{duration:1}}>Learn Anything</motion.h1>
            {/* <motion.h3 className={styles.leadText}  initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2}}>With a new and unique way to find a tutor</motion.h3> */}
            <div className={styles.downIcon}>
                {!user&&
                  <Link to="signinSection" smooth={true} duration={1000}>
                      <FontAwesomeIcon icon={faAngleDoubleDown} className={styles.arrow}/>
                  </Link>
                }
            </div>
          </div>
      </div>
    </React.Fragment>
    
  );
};
