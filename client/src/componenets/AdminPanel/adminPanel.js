import { set } from 'mongoose';
import React, { useEffect, useState,useContext } from 'react';
import styles from './adminPanel.module.scss';
import StatSec from './StatSec';
import StudentsSec from './StudentsSec';
import Loader from "../Loader/loader";
import TutorsSec from './TutorsSec';
import { Redirect,useLocation } from "react-router-dom";
import {userContext} from '../../context/userContext'
import PageNotFoundErrorPage from '../PageNotFoundErrorPage/pageNotFoundErrorPage';
const AdminPanel= (props)=> {
    const {setBannerMsg,user,userLoaded,setAlertMsg}=useContext(userContext);
    const [currentPanel,setCurrentPanel]=useState(0);
    const [isLoading,setIsLoading]=useState(1);
    const [isRedirecting,setIsRedirecting]=useState(0);
    const location=useLocation();

    useEffect(()=>{
        if(userLoaded&&user){
            setIsLoading(0);
        }
    },[user,userLoaded]);

    if(userLoaded&&!user){
        setBannerMsg({message:'Kindly login to continue'})
        return <Redirect to={{pathname:'/auth',state:{backUrl:location.pathname}}}/>
    }
    if(userLoaded&&user&&!user.isAdmin){
        return <PageNotFoundErrorPage/>
    }
    if(isLoading){
        return <div className={styles.adminPage}><Loader/></div>
    }
    else{
        return (
            <React.Fragment>
                <div className={styles.adminPage}>
                    <section className={styles.left}>
                        <div className={styles.menuHeading}>Admin Panel</div>
                        <div className={styles.menuItemsholder}>
                            <div className={styles.menuItem} style={currentPanel===0?{color:'#2876A0'}:{color:'#F3F3F3'}} onClick={()=>setCurrentPanel(0)}>Statistics</div>
                            <div className={styles.menuItem} style={currentPanel===1?{color:'#2876A0'}:{color:'#F3F3F3'}} onClick={()=>setCurrentPanel(1)}>Students' Ads</div>
                            <div className={styles.menuItem} style={currentPanel===2?{color:'#2876A0'}:{color:'#F3F3F3'}} onClick={()=>setCurrentPanel(2)}>Tutors' Ads</div>
                        </div>
                    </section>
                    <section className={styles.right}>
                        {currentPanel===0&&<StatSec/>}
                        {currentPanel===1&&<StudentsSec/>}
                        {currentPanel===2&&<TutorsSec/>}
                    </section>
                </div>
            </React.Fragment>
  );
}
}

export default AdminPanel;