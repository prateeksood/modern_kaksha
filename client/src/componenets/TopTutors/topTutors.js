import React,{useEffect,useState,useContext} from "react";
import axios from 'axios';
import styles from './topTutors.module.scss';
import UserCard from '../UserCard/userCard'
import {userContext} from '../../context/userContext'
const TopTutors= () => {
    const [profiles,setProfiles]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const {user,setBannerMsg}=useContext(userContext);
    useEffect(()=>{
        let data={
            feesPeriod:'allfees',
            pincodes:[],
            minimumFees:0,
            maximumFees:500000,
            subjects:[],
            pageNumber:1,
            pageSize:3
        }
        const fetchTeachers=async ()=>{
            setIsLoading(true)
            try{

                const res= await axios.post(`${process.env.REACT_APP_API_URL}/teachers/`,data);
                if(!res.data.error){
                setProfiles(res.data.result);
                }
            }
            catch(err){
                setBannerMsg({message:`Something went wrong!`});
                setIsLoading(false)
            }
                setIsLoading(false)
        }

        // const fetchStudents=async ()=>{
        //     setIsLoading(true)
        //     try{

        //         const res= await axios.post(`${process.env.REACT_APP_API_URL}/students/`,data);
        //         if(!res.data.error){
        //             setProfiles(res.data.result);
        //         }
        //     }
        //     catch(err){
        //         setBannerMsg({message:`Something went wrong!`});
        //         setIsLoading(false)
        //     }
        //         setIsLoading(false)
        // }
        if(user){
            if(user.accountType==='teacher'){
                // fetchStudents();
            }else{
                fetchTeachers();
            }
        }
        
    },[user]);
    return (
    <React.Fragment>
    {(user&&user.accountType==='student')&&<div className={styles.topTutors} > 
        <h2 className={styles.topTutorsTitle} >New Tutors</h2>
        <div className={styles.profiles}>
            <div className={styles.cardHolder}>
                {profiles.map((profile,i)=>(
                    <UserCard profile={profile} key={i} index={i}/>
                ))}
            </div>
        </div>
    </div>}
    </React.Fragment>
    
    );
};

export default TopTutors;