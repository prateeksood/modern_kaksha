import React,{useContext, useEffect,useState} from 'react';
import styles from './msgBanner.module.scss'
import {userContext} from "../../context/userContext"
import {motion} from 'framer-motion';
const MsgBanner=()=>{
    const [isDisconnected,setIsDisconnected]=useState(false)
    const {bannerMsg,setBannerMsg}=useContext(userContext);

    useEffect(()=>{
        window.addEventListener('online', handleConnectionChange);
        window.addEventListener('offline', handleConnectionChange);

        return ()=>{
            window.removeEventListener('online', handleConnectionChange);
            window.removeEventListener('offline', handleConnectionChange);
        }

    },[]);
    useEffect(()=>{
        if(isDisconnected){
            setBannerMsg({message:'No internet Connection.',timmer:1})
        }
        else{
            setBannerMsg();
        }
    },[isDisconnected]);
    const handleConnectionChange = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        if (condition === 'online') {
          const webPing = setInterval(
            () => {
              fetch('//google.com', {
                mode: 'no-cors',
                })
              .then(() => {
                setIsDisconnected(false);
                return clearInterval(webPing)
              })
              .catch(
                  setIsDisconnected(true)
              )
            }, 2000);
          return;
        }
  
        return setIsDisconnected(true);
    }

    return(
        <>
        {
            bannerMsg&&
            <motion.div  initial={{opacity:0,y:200}} animate={{opacity:1,y:0}} className={styles.msgBanner}>
                <div className={styles.message}>
                    {bannerMsg.message}
                </div>
            </motion.div>
        }
        </>
        
    )
}
export default MsgBanner;