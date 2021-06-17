import React,{useEffect, useState,useContext,useRef, useCallback} from "react";
import {Helmet} from "react-helmet";
import axios from 'axios'
import Select from 'react-dropdown-select';
import {subjects} from '../../data/data'
import styles from './connectPage.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/fontawesome-svg-core'
import UserCard from '../UserCard/userCard'
import {userContext} from '../../context/userContext'
import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader/loader";
import { Redirect, useHistory, useLocation } from "react-router-dom";

const ConnectPage=() => {
    const pageSize=5;
    const history=useHistory();
    const [refresh,setRefresh]=useState(true);
    const [isLoading,setIsLoading]=useState(true);
    const [hasMore,setHasMore]=useState(true);
    const [pageNumber,setPageNumber]=useState(1);
    const [profiles,setProfiles]=useState([]);
    const [feeModeFilter,setFeeModeFilter]=useState('allfees');
    const [minimumFees,setMinimumFees]=useState(0);
    const [maximumFees,setMaximumFees]=useState(500000);
    const {setBannerMsg,user,userLoaded,setAlertMsg}=useContext(userContext);
    const location=useLocation();
    const [data,setData]=useState({
        feesPeriod:'allfees',
        pincodes:[],
        minimumFees:0,
        maximumFees:500000,
        subjects:[],
        pageNumber:1,
        pageSize:pageSize
    })
    const [subjectList, setSubjectList]=useState(()=>{
        if(location.state){
            if(location.state.subjectList){
                return location.state.subjectList;
            }
        }
        return [];
    });
    const[nearAroundLocations,setNearAroundLocations]=useState([]);
    const [areLocationsLoading,setAreLocationsLoading]=useState(false);
    const [isFilterMenuOpen,setIsFilterMenuOpen]=useState(false);
    const [pincode,setPincode]=useState(()=>{
        if(location.state){
            if(location.state.pincode){
                return location.state.pincode;
            }
        }
        return
    });
    useEffect(()=>{
        if(refresh){
            setPageNumber(1);
        }
    },[refresh])
    useEffect(()=>{
        window.scroll(0,0)
    },[]);
    useEffect(()=>{
        if(userLoaded&&!user){
            setAlertMsg({message:'kindly login to continue'})
            history.push({
                pathname:'/auth',
                state:{backUrl:location.pathname}
            })
        }
        
        else if(userLoaded&&(user.accountType==='teacher')&&(!user.isVerified)){
            setAlertMsg({message:'kindly complete registeration to continue'})
            history.push({
                pathname:'/auth',
                state:{backUrl:location.pathname,formType:'tutorVerifyEmailForm'}
            })
        }
        else if(userLoaded&&(user.accountType==='teacher')&&(!user.isStepOneDone)){
            setAlertMsg({message:'kindly complete registeration to continue'})
            history.push({
                pathname:'/auth',
                state:{backUrl:location.pathname,formType:'tutorInfoForm'}
            })
        }

        else if(userLoaded&&(user.accountType==='teacher')&&(!user.isStepTwoDone)){
            setAlertMsg({message:'kindly complete registeration to continue'})
            history.push({
                pathname:'/auth',
                state:{backUrl:location.pathname,formType:'tutorFeeDetailForm'}
            })
        }
        
        else if(userLoaded&&(user.accountType==='student')&&(!user.isVerified)){
            setAlertMsg({message:'kindly complete registeration to continue'})
            history.push({
                pathname:'/auth',
                state:{backUrl:location.pathname,formType:'studentVerifyEmailForm'}
            })
        }
        else if(userLoaded&&(user.accountType==='student')&&(!user.isStepOneDone)){
            setAlertMsg({message:'kindly complete registeration to continue'})
            history.push({
                pathname:'/auth',
                state:{backUrl:location.pathname,formType:'studentInfoForm'}
            })
        }
        
    },[user,userLoaded])
    useEffect(()=>{
        const fetchTeachers=async ()=>{
            setIsLoading(true)
            try{
                const res= await axios.post(`/api/teachers/`,data);
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
                setBannerMsg({message:`Something went wrong!`});
                setIsLoading(false)
            }
            finally{
                setIsLoading(false)
            }
                
        }

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
            if(user.accountType==='teacher'){
                fetchStudents();
            }else{
                fetchTeachers();
            }
        }
        
    },[data,user]);
    useEffect(()=>{
        let pincodes=pincode;
        if(pincode){
            pincodes=[pincode,pincode+1,pincode-1]
        }else{
            pincodes=[];
        }
        setData({
            feesPeriod:feeModeFilter,
            pincodes:pincodes,
            minimumFees,
            maximumFees,
            subjects:subjectList,
            pageNumber,
            pageSize:pageSize
        })
    },[feeModeFilter,pincode,minimumFees,maximumFees,subjectList,setData,pageNumber]);
    const changePageNumber=()=>{
        setRefresh(false);
        setPageNumber(prev=>prev+1);
    }
    const changeFeeModeFilter=(e)=>{
        setFeeModeFilter(e.target.value);
        setRefresh(true);
    }

    const changeMinimumFees=(e)=>{
        setRefresh(true);
        if(!e.target.value){
            setMinimumFees(0)
        }
        else{
            setMinimumFees(e.target.value)
        }
    }

    const changeMaximumFees=(e)=>{
        setRefresh(true);
        if(!e.target.value){
            setMaximumFees(500000)
        }
        else{
            setMaximumFees(e.target.value)
        } 
    }

    const pincodeChangeHandler=(e)=>{
        setNearAroundLocations([]);
        setRefresh(true);
        setPincode(parseInt(e.target.value));
        if(e.target.value.length===6){
            let pin=parseInt(e.target.value)
            setAreLocationsLoading(true)
            const targetPins=[pin,pin+1,pin-1,pin+2,pin-2]
            targetPins.forEach((pin)=>{
                axios.get(`https://api.postalpincode.in/pincode/${pin}`)
                .then(res=>{
                    if(res.data[0].Status==="Success"){
                        res.data[0].PostOffice.forEach((location,i)=>{
                            setNearAroundLocations(prev=>[...prev,{id:(prev.length+1),name:location.Name}])
                        })
                    }
                    setAreLocationsLoading(false)
                })
                .catch(
                    err=>
                    {
                        console.log(err)
                        setBannerMsg({message:`Something went wrong!`});
                    }
                )
            })
            
        }

    }

    const showFilterMenu=()=>{
        setIsFilterMenuOpen(true)
    }

    const hideFilterMenu=()=>{
        setIsFilterMenuOpen(false)
    }

    const onSubjectChange=(subjects)=>{
        setRefresh(true);
        setSubjectList(subjects);
    }
    if(user)
    {
        return (
            <React.Fragment>
                {user.accountType==='student'?
                <Helmet>
                    <title>Find best tutor near you and online | Modern Kaksha</title>
                    <meta
                        name="description"
                        content="Find tutor near you. We at Modern Kaksha have tutors not only for subjects like Mathematics, Economics, Physics, Chemistry, Biology, Science, Social Studies, Hindi, English but also for extracurricular activities and sports."
                    />
                </Helmet>
                :
                <Helmet>
                    <title>Teach students near you and online | Modern Kaksha</title>
                    <meta
                        name="description"
                        content="Find students near you to teach. We at Modern Kaksha require tutors not only for subjects like Mathematics, Economics, Physics, Chemistry, Biology, Science, Social Studies, Hindi, English but also for extra extracurricular and sports."
                    />
                </Helmet>
                }
                <div className={styles.connectPage} >
                    <h2>Connect</h2>
                    
                    <div className={styles.container}>
                        {!isLoading?
                            (   
                                profiles.length>0?
                                <div className={styles.cardHolder}>
                                    {profiles.map((profile,i)=>(
                                        <UserCard profile={profile} key={i} index={i} />
                                    ))}  
                                </div>
                                :
                                <div className={styles.notFoundMsgHolder}>
                                    <div className={styles.notFoundMsg}>No profiles matching your requirements found.</div>
                                </div>
                            )
                            :
                            (
                                <div className={styles.cardHolder}></div>
                            )
                        }
                        <div className={isFilterMenuOpen?`${styles.filterHolder} ${styles.showFilters}`:`${styles.filterHolder}  ${styles.hideFilters}` }>
                            <div className={styles.filterTopBar}><span className={styles.emptySpan}></span><span className={styles.filterHeading}><FontAwesomeIcon icon={faFilter}/>Filter</span><span className={styles.crossSign} onClick={hideFilterMenu}><FontAwesomeIcon icon={faPlus}/></span></div>
                            <div className={styles.filterSection}>
                            { user.accountType==='student'&&
                                <>
                                    <div className={styles.filterSecHead}>Filter by fees</div>
                                    <div className={styles.inputHolder}>
                                        {/* <div><input type="radio" name="feesType" value='allfees' id='allfees' checked={feeModeFilter==='allfees'} onChange={changeFeeModeFilter}/><label htmlFor='allfees'>All</label></div>
                                        <div><input type="radio" name="feesType" value='hourly' id='hourly' checked={feeModeFilter==='hourly'} onChange={changeFeeModeFilter}/><label htmlFor='hourly'>Hourly fees</label></div>
                                        <div><input type="radio" name="feesType" value='daily' id='daily' checked={feeModeFilter==='daily'} onChange={changeFeeModeFilter}/><label htmlFor='daily'>Daily fees</label></div>
                                        <div><input type="radio" name="feesType" value='monthly' id='monthly' checked={feeModeFilter==='monthly'} onChange={changeFeeModeFilter}/><label htmlFor='monthly'>Monthly fees</label></div> */}
                                        <div className={styles.feeRangeHolder}>
                                            <div className={styles.minfeesHolder}>
                                                <input type='number' name='minFees'placeholder='Minimum' onChange={changeMinimumFees}/>
                                                </div>
                                            <div>To</div>
                                            <div className={styles.maxfeesHolder}>
                                                <input type='number' name='maxFees' placeholder='Maximum' onChange={changeMaximumFees}/>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                                
                            </div>
                            <div className={styles.filterSection}>
                                <div className={styles.filterSecHead}>Filter by subject</div>
                                <div className={styles.dropDownHolder}>
                                    <Select
                                        multi
                                        create
                                        options={subjects}
                                        onChange={onSubjectChange}
                                        color="#2876A0"
                                        labelField='value'
                                        sortBy='value'
                                    />
                                </div>
                            </div>
                            <div className={styles.filterSection}>
                                <div className={styles.filterSecHead}>Filter by location</div>
                                <div className={styles.pincodeInputHolder}>
                                    <input 
                                    type='number' 
                                    name='pincode' 
                                    id='pincode' 
                                    placeholder='Pincode'
                                    value={pincode || ""}
                                    onChange={pincodeChangeHandler}
                                    />
                                    </div>
                            </div>
                        </div>
                    </div>
                    {(hasMore&&!isLoading)&&
                        <div className={styles.loadMoreBtn} onClick={changePageNumber}>
                            <div >Load More</div>
                        </div>
                    } 
                    {(isLoading)&&
                        <div className={styles.loadMoreBtn}>
                            <div >Loading...</div>
                        </div>
                    } 
                    <div className={styles.filterBar} onClick={showFilterMenu}><FontAwesomeIcon  icon={faFilter}/>Filter</div>
                </div>
            </React.Fragment>
            
        );
    }else{
        return (
        <div className={styles.connectPage} >
            <Loader/>
        </div>)
    }
};
export default ConnectPage;