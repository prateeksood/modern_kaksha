import React, { useState,useContext, useEffect} from 'react'
import {Helmet} from "react-helmet";
import useForm from '../../hooks/useForm'
import validationRules from '../../validationRules/reviewFormValidationsRules'
import styles from './ProfilePage.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import {userContext} from '../../context/userContext';
import { Link, Redirect, useLocation,useParams} from 'react-router-dom'
import axios from 'axios'
import PageNotFoundErrorPage from '../PageNotFoundErrorPage/pageNotFoundErrorPage';
import Loader from '../Loader/loader';

const ProfilePage=()=>{
    const reasons=['Rude Behavior','Not taking classes','Harassment','Others (Mention in message box)']
    const [isLoading,setIsLoading]=useState(true);
    const [showReportForm,setShowReportForm]=useState(false);
    const [reviews,setReviews]=useState([]);
    const [avgRating,setAvgRating]=useState(0);
    const [rating,setRating]=useState(0);
    const [reportingReason,setReportingReason]=useState(reasons[0]);
    const [localErrors,setLocalErrors]=useState({});
    const [serverError,setServerError]=useState(false)
    const [localValues,setLocalValues]=useState({});
    const [userConnections,setUserConnections]=useState([]);
    const {userLoaded,user,setAlert,setBannerMsg } = useContext(userContext);
    const location=useLocation();
    let {id}=useParams();
    const [currentUser,setCurrentUser]=useState();
    
    useEffect(()=>{
        window.scroll(0,0)
    },[])
    useEffect(()=>{
        const fetchCurrentUser=async()=>{
            try{
                let res= await axios.get(`${process.env.REACT_APP_API_URL}/auth/find-by-id`, { params: {_id:id} })
                if(res.status===200){
                    setCurrentUser(res.data.result);
                }
                else{
                    setCurrentUser(null)
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
                setServerError(true);
            }  
            setIsLoading(false)  
        }
        fetchCurrentUser();
    },[id,setCurrentUser]);
    useEffect(()=>{
        const fetchConnections=async ()=>{
            setIsLoading(true);
            try{
                let res= await axios.post(`${process.env.REACT_APP_API_URL}/auth/find-multiple-by-id`, {connectionIDs:user.connections});
                if(res.status===200){
                    setUserConnections(res.data.result);
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
            }  
            setIsLoading(false) 
        }
        if(user&&currentUser&&(user._id===currentUser._id)){
            fetchConnections();
        }
    },[user,currentUser])
    useEffect(()=>{
        const fetchReviews=async ()=>{
            setIsLoading(true)
            setReviews([])
            try{
                const res=await axios.get(`${process.env.REACT_APP_API_URL}/reviews`, { params: {targetUserId: currentUser._id} });
                res.data.result.forEach(review=>{
                    setReviews(prev=>[...prev,review]);
                })
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
            }
            setIsLoading(false)
        }
        if(currentUser){
            fetchReviews();
        }
    },[setReviews,currentUser])
    useEffect(()=>{
        const calculateRating=()=>{
            let totalRating=0;
            reviews.forEach((review,i)=>{
                totalRating+=review.rating;
            })
            return Math.round(totalRating/reviews.length)
        }
        setAvgRating(calculateRating());
    },[reviews,setAvgRating])
    const toggleReportform=()=>{
        setShowReportForm(true);
    }
    const changeRating=(value)=>{
        setRating(value)
        setLocalErrors({...localErrors,rating:''})
    }
    const RatingStars=()=>{
        let stars=[];
        for(let i=1;i<=rating;i++){
            stars.push(<div className={styles.activeStar} key={i} onClick={()=>changeRating(i)}><FontAwesomeIcon icon={faStar}/></div>);
        }
        for(let j=rating+1; j<=5;j++){
            stars.push(<div key={j}><FontAwesomeIcon icon={faStar} onClick={()=>changeRating(j)}/></div>);
        }
        return <>{stars}</>;
    }
    const LocalChangeHandler=(e)=>{
        e.persist();
        setLocalValues({...localValues,[e.target.name]:e.target.value})
        if(e.target.value===''){
            setLocalErrors({...localErrors,[e.target.name]:`This field is required`})
        }
        else{
            setLocalErrors({...localErrors,[e.target.name]:``})
        }
    }
    const reviewHandler = async () => {
        if(rating>0&&(currentUser._id!==user._id)){
            setLocalErrors({...localErrors,rating:''})
            const data = {
                rating:rating,
                reviewTitle: values.reviewTitle,
                reviewBody: values.reviewBody,
                targetUserId:currentUser._id,
                reviewerName:user.name,
                reviewerId:user._id
            }
            try{
                setIsLoading(true)
                const res= await axios.post(`${process.env.REACT_APP_API_URL}/reviews/`,data);
                if(!res.data.error){
                    setReviews(prev=>[...prev,res.data.result]);
                    setBannerMsg({message:'Review successfully submited'})
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
            }
            finally{
                setIsLoading(false)
            }
            values.reviewBody='';
            values.reviewTitle='';
            setRating(0);
        }
        else if(rating<=0){
            setLocalErrors({...localErrors,rating:'Please rate the user'})
        }
        else if(currentUser._id===user._id){
            setAlert({message:'You can not review yourself'})
        }
    };
    const reportHandler = async (e) => {
        e.persist();
        e.preventDefault(); 
        if(!localValues.reportingMsg){
            setLocalErrors({...localErrors,reportingMsg:'Please write detailed explaination'})
        }
        else{
            setLocalErrors({...localErrors,reportingMsg:''})
            const data = {
                name:user.name,
                email:user.email,
                contactNumber:user.contactNumber,
                message:localValues.reportingMsg,
                reason:reportingReason,
                type:'reportingUser',
                targetUser:currentUser._id,
                reportingUser:user._id
            }
            try{
                setIsLoading(true)
                let res= await axios.post(`${process.env.REACT_APP_API_URL}/messages`, data);
                if(res.status===200){
                    console.log('Submited');
                    setBannerMsg({message:`Thanks for reporting. We will look into the matter.`});
                    setShowReportForm(false);
                    setLocalValues(prev=>({...prev,reportingMsg:''}));
                } 
            }
            catch(err){
                console.log(err)
                alert(err)
                setBannerMsg({message:`Something went wrong!`});
                setIsLoading(false);
            }
            finally{
                setIsLoading(false);
            }
        }
        
    };
    const handleReasonChange=(e)=>{
        setReportingReason(e.target.value);
    }
    const { values , errors, handleChange, handleSubmit } = useForm(
    reviewHandler,
    validationRules
    );
    const Stars=({rating})=>{
        let stars=[]
        for(let i=1;i<=rating;i++){
            stars.push(<div className={styles.activeStar} key={i}><FontAwesomeIcon icon={faStar}/></div>);
        }
        for(let i=rating+1;i<=5;i++){
            stars.push(<div  key={i}><FontAwesomeIcon icon={faStar}/></div>)
        }
        return stars;
    }
    if(!user&&userLoaded&&!isLoading){
        setBannerMsg({message:'Kindly login to continue'})
        return <Redirect to={{pathname:'/auth',state:{backUrl:location.pathname}}}/>
    }
    if(userLoaded&&currentUser&&!(user._id===currentUser._id)&&!(user.connections.some((connection)=>{return currentUser._id===connection}))){
        return <PageNotFoundErrorPage/>
    }
    if(serverError){
        return <PageNotFoundErrorPage/>
    }
    if(!isLoading&&userLoaded&&currentUser){
        return(
            <React.Fragment>
                <Helmet>
                    <title>{currentUser.name} | Delta Educators</title>
                    <meta
                        name="description"
                        content={`User profile : ${currentUser.name}. Subjects: ${currentUser.subjects}`}
                    />
                </Helmet>
                <div className={styles.profilePage}>
                    <div className={styles.profileHolder}>
                        <div className={styles.topHalf}>
                            <div className={styles.imageHolder}>
                                <img src={`http://localhost:2700/uploads/profilePictures/${currentUser.profilePicture}`} alt='Profile Avatar'></img>
                            </div>
                            <div className={styles.mainDetails}>
                                <div className={styles.profileName}>{currentUser.name}</div>
                                <div className={styles.location}><FontAwesomeIcon icon={faMapMarkerAlt}/> {currentUser.district}, {currentUser.state}</div>
                                {currentUser._id===user._id&&<div>{user.connectsLeft} Connects Available</div>}
                                <div className={styles.ratingContainer}>
                                    <Stars rating={avgRating}/>
                                </div>
                                <div className={styles.skillConatiner}>
                                    {
                                        currentUser.subjects.map((subject,i)=>{
                                        return <div className={styles.skill} key={i}>{subject}</div>
                                        })
                                    }
                                </div>
                                {(currentUser._id!==user._id)&&!showReportForm&&<div className={styles.reportBtn} onClick={toggleReportform}><span>Report</span></div>}
                            </div>
                        </div>
                        {userConnections.length>0&&
                            <div className={styles.middleSection}>
                                <div className={styles.secBelowPic}></div>
                                <div className={styles.connectionsHolder}>
                                    <div className={styles.connectionsFormHeading}>Connections</div>
                                    <ul>
                                        {userConnections.map((profile,i)=>{
                                            return<li key={i} onClick={()=>setUserConnections([])}><Link to={`${profile._id}`}>{profile.name}</Link> </li>
                                        })}
                                    </ul>
                                   
                                </div>
                            </div>
                        }

                        {showReportForm&&
                            <div className={styles.reportForm} onSubmit={reportHandler}>
                                <div className={styles.secBelowPic}></div>
                                <form className={styles.formHolder}>
                                    <div className={styles.reportFormHeading}>Report User</div>
                                    <label htmlFor='reportingReason'>Reason for reporting</label>
                                    <select name='reportingReason' required={true} value={reportingReason} onChange={handleReasonChange}>
                                        {reasons.map((reason,key)=>{
                                            return <option key={key} value={reason}>{reason}</option>
                                        })}
                                    </select>
                                    <label htmlFor='reportingMsg'>Kindly write all the details</label>
                                    <textarea name='reportingMsg' rows='10' value={localValues.reportingMsg} onChange={LocalChangeHandler}></textarea>
                                    <div className={styles.errorMsg}>{localErrors.reportingMsg}</div>
                                    <input type='submit' value='Report'/>
                                </form>
                            </div>
                        }
                        <div className={styles.bottomHalf}>
                            <div className={styles.secBelowPic}></div>
                            <div className={styles.bottomInfoContainer}>
                                <div className={styles.contactInfoHeading}>Contact Information</div>
                                <div className={styles.contactInfoHolder}>
                                    <div>
                                        <div className={styles.infoHead}>E-mail : </div>
                                        <div><a href={`mailto:${currentUser.email}`}>{currentUser.email}</a></div>
                                    </div>
                                    <div>
                                        <div className={styles.infoHead}>Phone : </div>
                                        <div><a href={`tel:+91${currentUser.contactNumber}`}>+91-{currentUser.contactNumber}</a></div>
                                    </div>
                                </div>
                                <div className={styles.reviewSecHeading}>Recent Reviews</div>
                                <div className={styles.reviewHolder}>
                                    {reviews.map((review,i)=>{
                                        return(
                                            <div className={styles.review} key={i}>
                                                <div className={styles.reviewHead}>{review.reviewTitle}</div>
                                                <div className={styles.reviewBody}>
                                                    <div className={styles.reviewer}><FontAwesomeIcon icon={faUser}/>{review.reviewerName}</div>
                                                    <div className={styles.reviewText}>{review.reviewBody}</div>
                                                </div>
                                                <div className={styles.reviewHead}><Stars rating={review.rating}/></div>
                                            </div>
                                        )
                                    })}   
                                </div>

                                {(currentUser._id!==user._id)&&
                                <>
                                    <div className={styles.submitReviewHeading}>Review User</div>
                                    <form className={styles.submitReviewSec} onSubmit={handleSubmit}>
                                        <div className={styles.ratingForm}>
                                            <RatingStars/>
                                        </div>
                                        <div className={styles.errorMsg}>{localErrors.rating}</div>
                                        <label htmlFor="reviewTitle">Title</label>
                                        <input 
                                            type="text" 
                                            name="reviewTitle"
                                            value={values.reviewTitle || ""}
                                            onChange={handleChange}
                                        />
                                        <div className={styles.errorMsg}>{errors.reviewTitle}</div>
                                        <label htmlFor="reviewBody">Review</label>
                                        <textarea 
                                            rows="10" 
                                            name="reviewBody"
                                            onChange={handleChange}
                                            value={values.reviewBody || ""}
                                        >
                                            
                                        </textarea>
                                        <div className={styles.errorMsg}>{errors.reviewBody}</div>
                                        <input type="submit"/>
                                    </form>
                                </>
                                }
                            </div>

                        </div>
                    </div>
                    
                </div>
            </React.Fragment>
        )
    }
    else{
        return <div className={styles.profilePage}><Loader/></div>
    }
}

export default ProfilePage;