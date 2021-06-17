import React,{useEffect,useContext, useState} from "react";
import axios from 'axios';
import styles from './userCard.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import {userContext} from '../../context/userContext';
import placeHolderImg from '../../resources/images/profile-pic-placeholder.png';
const UserCard=({profile,subject}) => {
    const {user,setUser,setAlertMsg}=useContext(userContext);
    const [isConnecting,setIsConnecting]=useState(false);
    const [connectionSuccess,setConnectionSuccess]=useState(false);
    const [targetUserId,setTargetUserId]=useState();
    const history=useHistory();


    useEffect(()=>{
        if(connectionSuccess&&targetUserId){
            history.push({
                pathname:`profile/${targetUserId}`
            })
        }
    },[connectionSuccess,targetUserId]);

    useEffect(()=>{
        Aos.init({duration:2000})
    },[])

    const handleConnect=async (profileId)=>{
        setIsConnecting(true)
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
                if(user.connectsLeft>0){
                    const config = {
                        headers: {
                            'x-auth-token':localStorage.getItem("token")
                        }
                    };
                    let res=await axios.post(`/api/connects/redeem`,{targetUserId:profileId},config);
                    if(res.data.error){
                        setAlertMsg({message:res.data.error})
                    }else{
                        setConnectionSuccess(true);
                        if(user.connectsLeft!=='Unlimted'){
                            setUser({...user,connectsLeft:user.connectsLeft-1,connections:[...user.connections,profileId]});
                        }
                    }
                }
                else{
                    setAlertMsg({message:'You dont have enough credits. Kindly buy more credits to contiue'});
                }   
            }
        }
        setIsConnecting(false);
    }      

    return (
    <React.Fragment>
        <div className={styles.card} data-aos='zoom-in'>
            {profile.classGroups&&
                <div  className={styles.classesHolder}>
                    {
                        profile.classGroups.map(classGroup=>(
                            <div>{classGroup.value}</div>
                        ))
                    }
                    
                </div>
            }
            {profile.classOfStudy&&
                <div className={styles.classesHolder}>
                   <div>{ profile.classOfStudy.value}</div>
                </div>
            }
            {
            profile.profilePicture!=='undefined'?
                <div className={styles.profilePicHolder}><img src={`http://modernkaksha.com/api/uploads/profilePictures/${profile.profilePicture}`}/></div>
            :
                <div className={styles.profilePicHolder}><img src={placeHolderImg}/></div>
            }
            <div className={styles.profileName}>{profile.name.split(' ')[0]} {profile.name.split(' ')[1]}</div>
            {profile.district&&<div className={styles.profileLocation}><FontAwesomeIcon icon={faMapMarkerAlt}/>{profile.district.split(',')[0]||''}</div>}
            <div className={styles.discriptionBox}>
                    {profile.discription}
            </div>
            <div className={styles.skillsSection}>
                {/* {profile.subjects.map((skill,j)=>( */}
                    <div className={styles.profileSkill}>{profile.subject.value}</div>
                {/* ))} */}
            </div>
            

            {
                user?
                    profile.isAdActive?
                        isConnecting?
                            <div className={styles.hireBtnDisabled} >Connecting...</div>
                            : 
                            <div className={styles.hireBtn} onClick={()=>handleConnect(profile.ownerId)}>Connect</div>
                        :
                        <div className={`${styles.hireBtn} ${styles.disabledHireBtn}`}>Requirement Fulfilled</div>
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
            {profile.teachingMode!=='online'&&<div className={styles.locationsSection}>
                {profile.teachingLocation&&
                    profile.teachingLocation.map((location,j)=>(
                    <div key={j} className={styles.location}><FontAwesomeIcon icon={faMapMarkerAlt}/>{location.value}</div>
                ))}
            </div>}
            {(profile.teachingMode==='online'||profile.studyingMode==="online")&&<div className={styles.locationsSection}>
                <div  className={styles.location}><FontAwesomeIcon icon={faMapMarkerAlt}/>Online</div>
            </div>}
            
            {profile.feeAmount&&
                <div className={styles.feesAmountHolder}>
                    <div><FontAwesomeIcon icon={faRupeeSign}/>{profile.feeAmount}/Class</div>
                </div>
            }
            
        </div>
    </React.Fragment>
    
    );
};
export default UserCard;