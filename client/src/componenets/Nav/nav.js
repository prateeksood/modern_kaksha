import React, { useEffect, useState,useContext} from "react";
import { userContext } from "../../context/userContext";
import { NavLink,useLocation, Link, Redirect, useHistory} from "react-router-dom";
import {motion} from 'framer-motion'
import Aos from 'aos';
import logo from '../../resources/images/logo2.png'
import 'aos/dist/aos.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faSignInAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import styles from './nav.module.scss';
const Nav =() => {
  const {alertMsg,setAlertMsg,user,userLoaded,setUser,setBannerMsg} = useContext(userContext);
  const location=useLocation();
  const [isNavOpen,setIsNavOpen]=useState(false);
  const [isSubMenuOpen,setIsSubMenuOpen]=useState(false);
  const history=useHistory();
  useEffect(()=>{
    if(alertMsg){
      window.setTimeout(()=>{
          setAlertMsg(null)
      },3000);
    }
  },[alertMsg])

  const logout=()=>{
    localStorage.removeItem('token');
    setUser(null);
    setBannerMsg({message:'Logged out successfully'});
    closeNav();
    
  }
  const [showThinNav,setShowThinNav]=useState(()=>{
    if(location.pathname==='/'){
      return false;
    }
    else{
      return true;
    }
  });
  const [scrollHeight,setScrollHeight]=useState(()=>{
    if(location.pathname==='/'){
      return (250);
    }
    else{
      return (0);
    }
  });
  
  useEffect(()=>{
    if(location.pathname==='/'){
      setScrollHeight(250);
    }
    else{
      setScrollHeight(0);
    }
  },[location])

  useEffect(()=>{
    Aos.init({duration:2000})
  },[])

  useEffect(()=>{
    if(location.pathname==='/'){
      setShowThinNav(false);
    }
    else{
      setShowThinNav(true);
    }
    window.addEventListener('scroll',toggleThinNav);
    return ()=>{
       window.removeEventListener('scroll',toggleThinNav);
    }
  },[scrollHeight]);


  const toggleProfileSubMenu=()=>{
    setIsSubMenuOpen(prev=>!prev);
  }

  const toggleNav=()=>{
      setIsNavOpen(prev=>!prev)
  }


  const closeNav=()=>{
    setIsNavOpen(false)
  }


  const toggleThinNav=()=>{
    if(window.scrollY>=scrollHeight){
      setShowThinNav(true);
    }
    else{
      setShowThinNav(false);
    }
  }
  return (
    
    <React.Fragment>
      {location.pathname==='/'&&
      <>
      <div className={styles.burgerMenu} ><FontAwesomeIcon icon={faBars} onClick={toggleNav}></FontAwesomeIcon></div>
      <motion.nav initial={{opacity:0}} animate={{opacity:1}} className={isNavOpen?`${styles.activeNav} ${styles.nav}`:`${styles.hiddenNav} ${styles.nav}`}>
        <div className={styles.navBar}>
            <div className={styles.navLinkContainer}>
              <div className={styles.closeBtn}><FontAwesomeIcon icon={faPlus}  onClick={toggleNav}></FontAwesomeIcon></div>
              <div className={`${styles.navLink}`} onClick={closeNav}><NavLink exact to="/" activeClassName={styles.activeNavLink}>Home</NavLink></div>
              <div className={styles.navLink}><NavLink exact to="/connect" onClick={closeNav} activeClassName={styles.activeNavLink}>Connect</NavLink></div>
              <div className={styles.navLink}><NavLink exact to="/choose-plan" onClick={closeNav} activeClassName={styles.activeNavLink}>Buy Credits</NavLink></div>
              <div className={styles.navLink}><NavLink exact to="/contact-us" onClick={closeNav} activeClassName={styles.activeNavLink}>Contact Us</NavLink></div>
              {user?
                <>
                  <div className={styles.mobileOnlyNavLink}><NavLink exact to={`/profile/${user._id}`} onClick={closeNav}>{user.connectsLeft} Connects</NavLink></div>
                  <div className={styles.mobileOnlyNavLink}><NavLink to={`/profile/${user._id}`} onClick={closeNav} activeClassName={styles.activeNavLink}>View Profile</NavLink></div>
                  {location.pathname!=='/auth'&&<div className={styles.mobileOnlyNavLink} onClick={logout}>Logout</div>}
                </>
              :
                <div className={styles.mobileOnlyNavLink}><NavLink exact to="/auth" onClick={closeNav}>Login</NavLink></div>
              }
            </div> 
        </div>
      </motion.nav>
      </>
}
{showThinNav&&
    <>
      <motion.nav className={styles.thinNav} initial={{height:0,opacity:0}} animate={{height:'70px',opacity:1}} transition={{ duration: .2 }}>
        <div className={styles.thinNavHolder}>
        <Link to="/" className={styles.titleHolder}><img src={logo}/> <div className={styles.thinNavTitle}>Delta Educators</div></Link>
          <div className={isNavOpen?`${styles.activeNav} ${styles.navLinkContainer}`:`${styles.hiddenNav} ${styles.thinNavLinkContainer}`}>
              <div className={styles.closeBtn}><FontAwesomeIcon icon={faPlus} onClick={toggleNav}></FontAwesomeIcon></div>
              <div className={styles.navLink}><NavLink exact to="/" onClick={closeNav} activeClassName={styles.activeThinNavLink}>Home</NavLink></div>
              <div className={styles.navLink}><NavLink exact to="/connect" onClick={closeNav} activeClassName={styles.activeThinNavLink}>Connect</NavLink></div>
              <div className={styles.navLink}><NavLink exact to="/choose-plan" onClick={closeNav} activeClassName={styles.activeThinNavLink}>Buy Credits</NavLink></div>
              <div className={styles.navLink}><NavLink exact to="/contact-us" onClick={closeNav} activeClassName={styles.activeThinNavLink}>Contact Us</NavLink></div>
              {user?
                <>
                  <div className={styles.mobileOnlyNavLink}><NavLink exact to={`/profile/${user._id}`} onClick={closeNav}>{user.connectsLeft} Connects</NavLink></div>
                  <div className={styles.mobileOnlyNavLink}><NavLink to={`/profile/${user._id}`} onClick={closeNav} activeClassName={styles.activeThinNavLink}>View Profile</NavLink></div>
                  {location.pathname!=='/auth'&&<div className={styles.mobileOnlyNavLink} onClick={logout}>Logout</div>}
                </>
              :
                  <div className={styles.mobileOnlyNavLink}><NavLink exact to="/auth" onClick={closeNav}>Login</NavLink></div>
              }
              
              {user?
                <div className={`${styles.navLink} ${styles.profileLink}`} onClick={toggleProfileSubMenu}><FontAwesomeIcon icon={faUser}/>{user.name.split(" ")[0]}</div>
              :
              <div className={`${styles.navLink} ${styles.profileLink}`}><Link to="/auth"><FontAwesomeIcon icon={faSignInAlt}/>Login</Link></div>
              }
          </div>
          <motion.div className={styles.burgerMenuThinNav} initial={{fontSize:'0'}} animate={{fontSize:'2.5em'}}><FontAwesomeIcon icon={faBars} onClick={toggleNav} ></FontAwesomeIcon></motion.div>
        </div>
        {alertMsg&&
        <motion.div className={styles.errorBanner} initial={{opacity:0,y:-30}} animate={{opacity:1,y:0}}>
          <div>{alertMsg.message}</div>
          <span onClick={()=>{setAlertMsg(null)}}>X</span>
        </motion.div> }
       {(user&&isSubMenuOpen)&&
          <motion.div className={styles.profileSubMenu} initial={{opacity:0,y:-100}} animate={{opacity:1,y:0}}>
            <div className={styles.triangleTip}></div>
            <div className={styles.profileSubMenuItemHolder}>
              <div className={styles.subLink}>{user.connectsLeft} Connects</div>
              <div className={styles.subLink} onClick={toggleProfileSubMenu}><Link to={`/profile/${user._id}`}>View Profile</Link></div>
              {location.pathname!=='/auth'&&<div className={styles.subLink} onClick={logout}>Logout</div>}
            </div>
          </motion.div>
      }
      </motion.nav>
      
      </>
}
    </React.Fragment>  
  );
};
export default Nav;
