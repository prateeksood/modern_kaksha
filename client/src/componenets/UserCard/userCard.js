import React,{useEffect,useContext, useState} from "react";
import axios from 'axios';
import styles from './userCard.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import {userContext} from '../../context/userContext';
const UserCard=({profile}) => {
    const {user,setUser,setAlertMsg}=useContext(userContext);
    const [connectionSuccess,setConnectionSuccess]=useState(false);
    const [targetUserId,setTargetUserId]=useState();
    const history=useHistory();


    useEffect(()=>{
        if(connectionSuccess&&targetUserId){
            console.log(targetUserId);
            history.push({
                pathname:`profile/${targetUserId}`
            })
        }
    },[connectionSuccess,targetUserId]);

    useEffect(()=>{
        Aos.init({duration:2000})
    },[])

    const handleConnect=async (profileId)=>{
        setTargetUserId(profileId);
        let idMatch=user.connections.some((connection)=>{
            return connection===profileId
        })
        if(idMatch){
            setAlertMsg({message:'You are already connected to this user'});
            setConnectionSuccess(true);
        }else{
            let confirmation=window.confirm('Do you want to use 1 credit to connect?')
            if(confirmation){
                const config = {
                    headers: {
                        'x-auth-token':localStorage.getItem("token")
                    }
                };
                let res=await axios.post(`${process.env.REACT_APP_API_URL}/connects/redeem`,{targetUserId:profileId},config);
                if(res.data.error){
                    setAlertMsg({message:res.data.error})
                }else{
                    setConnectionSuccess(true);
                    if(user.connectsLeft!=='Unlimted'){
                        setUser({...user,connectsLeft:user.connectsLeft-1,connections:[...user.connections,profileId]});
                    }
                }
            }
        }
    }      

    return (
    <React.Fragment>
        <div className={styles.card} data-aos='zoom-in'>
            {profile.classGroups&&
                <div  className={styles.classesHolder}>
                    {
                        profile.classGroups.map(classGroup=>(
                            <div>{classGroup}</div>
                        ))
                    }
                    
                </div>
            }
            <div className={styles.profilePicHolder}><img src={`http://localhost:2700/uploads/profilePictures/${profile.profilePicture}`}/></div>
            <div className={styles.profileName}>{profile.name.split(' ')[0]} {profile.name.split(' ')[1]}</div>
            <div className={styles.profileLocation}><FontAwesomeIcon icon={faMapMarkerAlt}/>{profile.district||''}</div>
            <div className={styles.skillsSection}>
                {profile.subjects.map((skill,j)=>(
                    <div key={j} className={styles.profileSkill}>{skill}</div>
                ))}
            </div>
            {
                user?<div className={styles.hireBtn} onClick={()=>handleConnect(profile._id)}>Connect</div>
                :
                <Link className={styles.hireBtn} 
                    to={
                        {
                            pathname:`/auth`,
                            state:{
                                formType:'studentLogin'
                            }
                        }
                    }
                >Connect</Link>
            }
            <div className={styles.locationsSection}>
                {profile.teachingLocation&&
                    profile.teachingLocation.map((location,j)=>(
                    <div key={j} className={styles.location}><FontAwesomeIcon icon={faMapMarkerAlt}/>{location}</div>
                ))}
            </div>
            {profile.classOfStudy&&
                <div className={styles.classesHolder}>
                   <div>{ profile.classOfStudy}</div>
                </div>
            }
            
            {profile.feeAmount&&
                <div className={styles.feesAmountHolder}>
                    <div><FontAwesomeIcon icon={faRupeeSign}/>{profile.feeAmount}/{profile.feesPeriod==='monthly'?'Month':profile.feesPeriod==='daily'?'Day':'Hour'}</div>
                </div>
            }
            
        </div>
    </React.Fragment>
    
    );
};
export default UserCard;