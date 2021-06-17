import React, { useEffect, useState,useContext } from 'react';
import styles from './adminPanel.module.scss';
import axios from 'axios'
import {userContext} from '../../context/userContext'
import { Redirect, useHistory, useLocation } from "react-router-dom";
import PageNotFoundErrorPage from '../PageNotFoundErrorPage/pageNotFoundErrorPage';
const StudentsSec= (props)=> {
    const {setBannerMsg,user,userLoaded,setAlertMsg}=useContext(userContext);
    const months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October','November','December']
    const pageSize=20;
    const history=useHistory();
    const [refresh,setRefresh]=useState(true);
    const [isLoading,setIsLoading]=useState(true);
    const [hasMore,setHasMore]=useState(true);
    const [profiles,setProfiles]=useState([]);
    const location=useLocation();
    const [data,setData]=useState({
        feesPeriod:'allfees',
        pincodes:[],
        minimumFees:0,
        maximumFees:500000,
        subjects:[],
        pageNumber:1,
        pageSize:pageSize
    });
    const changePageNumber=()=>{
        setRefresh(false);
        setData(prev=>({...prev,pageNumber:prev.pageNumber+1}));
    }
    useEffect(()=>{
        const fetchStudents=async ()=>{
            setIsLoading(true);

            try{

                const res= await axios.post(`/api/students/`,data);
                if(!res.data.error){
                    setHasMore(res.data.result.length===pageSize)
                    if(refresh){
                        setProfiles(res.data.result);
                    }
                    else{
                        setProfiles(prev=>prev.concat(res.data.result));
                    }
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
                setIsLoading(false)
            }
            finally{
                setIsLoading(false)
            }
                
        }
        if(user&&user.isStepOneDone&&user.isVerified){
            fetchStudents();
        }
    },[data,user]);
    const handleAdActiveChange=async(adID,activeStatus)=>{
        let data={
            _id:adID,
            isAdActive:!activeStatus,
        }
        const config = {
            headers: {
                'x-auth-token':localStorage.getItem("token")
            }
        };
        try{
            const res = await axios.put(`/api/students/updateAd`,data,config);
            const updatedAds = profiles.map(ad =>
                ad._id === adID
                    ? { ...ad, isAdActive:!activeStatus}
                    : ad
            );
            setProfiles(updatedAds);
            setBannerMsg({message:'Ad Status successfully updated'});
        }
        catch(err){
            console.log(err);
            setBannerMsg({message:`Something went wrong!`});
        }
    }
    if(!user&&userLoaded&&!isLoading){
        setBannerMsg({message:'Kindly login to continue'})
        return <Redirect to={{pathname:'/auth',state:{backUrl:location.pathname}}}/>
    }
    if(userLoaded&&user&&!user.isAdmin){
        return <PageNotFoundErrorPage/>
    }
    return (
        <React.Fragment>
            <div className={styles.studentsMainSection}>
                <h1 className={styles.heading}>Students' Ads</h1>
                {/* <div className={styles.searchHolder}>
                    <input type="search" name="searchStudent" className={styles.searchInput}/>
                    <input type="submit" value="Search" className={styles.searchBtn}/>
                </div> */}
                <div className={styles.studentsMainTable}>
                    <div className={styles.recordHead}>
                        <div className={styles.serialNo}>S.No</div>
                        <div className={styles.name}>Name</div>
                        <div className={styles.date}>Date</div>
                        <div className={styles.studyingMode}>Mode of Study</div>
                        <div className={styles.contact}>Subject</div>
                        <div className={styles.action}>Actions</div>
                    </div>
                    {
                        profiles.map((ad,key)=>(
                            <div className={styles.record} key={key}>
                                <div className={styles.serialNo}>{key+1}</div>
                                <div className={styles.name}>{ad.name}</div>
                                <div className={styles.date}>{`${new Date(ad.date).getDate()}-${months[new Date(ad.date).getMonth()]}-${new Date(ad.date).getFullYear()}`}</div>
                                <div className={styles.studyingMode}>{ad.studyingMode}</div>
                                <div className={styles.contact}>{ad.subject.value}</div>
                                <div className={styles.action}>
                                {ad.isAdActive?
                                    <span className={styles.activeTag} onClick={()=>handleAdActiveChange(ad._id,ad.isAdActive)}>Active</span>:
                                    <span className={styles.InactiveTag} onClick={()=>handleAdActiveChange(ad._id,ad.isAdActive)}>Inactive</span>
                                }
                                    <span className={styles.viewBtn}><a href={`/profile/${ad.ownerId}`}>View</a></span>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {(hasMore&&!isLoading)&&
                    <div className={styles.loadMoreBtn} onClick={changePageNumber}>
                        <div >Load More</div>
                    </div>
                } 
                {(isLoading)&&
                    <div className={styles.loading}>
                        <div >Loading...</div>
                    </div>
                }
            </div>
        </React.Fragment>
  );
}

export default StudentsSec;