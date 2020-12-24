import React from "react";
import {motion} from 'framer-motion'
import styles from './header.module.scss';
import logo from '../../resources/images/logo2.png'
import { useLocation } from "react-router-dom";
export default () => {
  const location=useLocation();

  return (
    <React.Fragment>
      {location.pathname==='/'&&
      <motion.header initial={{opacity:0}} animate={{opacity:1}}>
        <div className={styles.siteBanner}>
          <div className={styles.logo}><img src={logo}></img></div>
          <div className={styles.siteTitle}>
            Delta Educators
          </div>
        </div>
      </motion.header>
}
    </React.Fragment>
    
  );
};
