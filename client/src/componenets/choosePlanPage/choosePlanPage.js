import React, { useContext, useEffect, useState } from 'react'
import {Helmet} from "react-helmet";
import  axios from 'axios';
import styles from './choosePlanPage.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign} from '@fortawesome/free-solid-svg-icons';
import {userContext} from '../../context/userContext'
import logo from '../../resources/images/logo2.png'
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import PaymentSuccessPage from '../PaymentSuccessPage/paymentSuccessPage'
import Loader from '../Loader/loader';

const ChoosePlanPage=()=>{
    const history=useHistory();
    const location=useLocation();
    const [data,setData]=useState();
    const {user,userLoaded,setBannerMsg,setAlertMsg,setUser}=useContext(userContext);
    const [isLoading,setIsLoading]=useState(false);
    const [orderSuccess,setOrderSuccess]=useState(false);
    const [paymentId,setPaymentId]=useState();
    const selectPlan=(connects,planName,duration,price)=>{
            setIsLoading(true);
            setData({
            connects,
            planName,
            duration,
            price,
            expiry:(new Date(new Date().getFullYear(),new Date().getMonth() +duration, new Date().getDate())),
            userId:user._id
        });
    }
    useEffect(()=>{
        if(userLoaded&&!user){
            setAlertMsg({message:'Kindly login to continue'})
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
    },[userLoaded,user])
    useEffect(()=>{
        const processPayment=async()=>{
            try{
                let res=await axios.post(`/api/orders`,{price:data.price},{headers:{'x-auth-token':localStorage.getItem("token")}});
                if(!res.status===200){
                    console.log('Something went wrong');
                    setBannerMsg({message:`Something went wrong!`});
                }
                console.log(res.data.order.id);
                let options = {
                    "key": process.env.REACT_APP_RAZORPAY_KEY,
                    "amount": res.data.order.amount*100,
                    "currency": "INR",
                    "name": 'Modern Kaksha',
                    'image':{logo},
                    "description":`${data.planName} Pack`,
                    "order_id": res.data.order.id,
                    "handler": async (response)=> {
                        const orderDetails = {
                            orderCreationId:res.data.order.id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            ...data
                        };
                        let body=document.querySelector('body');
                        body.style={overflow:'scroll'};
                        let result=await axios.post(`/api/orders/success`,orderDetails,{headers:{'x-auth-token':localStorage.getItem("token")}});     
                        if(result.status!==200){
                            console.log(result.data.error);
                        }
                        setPaymentId(response.razorpay_payment_id);
                        if(data.connects>=9999999){
                            setUser({...user,connectsLeft:'Unlimited'})
                        }
                        else{
                            setUser({...user,connectsLeft:parseInt(user.connectsLeft)+parseInt(data.connects)})
                        }
                        
                        setIsLoading(false);
                        setOrderSuccess(true);
                    },
                    "prefill": {
                        "name": `${user.name}`,
                        "email": `${user.email}`,
                        "contact": `${user.contactNumber}`
                    },
                    "theme": {
                        "color": "#2876A0"
                    },
                    "modal": {
                        "ondismiss": function(){
                            let body=document.querySelector('body');
                            body.style={overflow:'scroll'};
                            setIsLoading(false);
                        }
                    }
                };
                try{
                    let razorpayWindow = new window.Razorpay(options);
                    razorpayWindow.open();
                }
                catch(err){
                    console.log(err);
                    setBannerMsg({message:`Something went wrong!`});
                }
                finally{
                    setIsLoading(false)
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
            }
            finally{
                setIsLoading(false)
            }
        }
        if(data){
            processPayment();
        }
    },[data])
    
    if(!userLoaded){
        return <div className={styles.choosePlanPage}>
                <Helmet>
                    <title>Buy Connects | Choose Plan | Modern Kaksha</title>
                    <meta
                        name="description"
                        content="Buy Delta Eductors Connects. Start Connecting with tutors and students from all over the India and near you. Start teaching at your ease, near you or online. "
                    />
                </Helmet>
                <Loader/>
            </div>
    }
    if(orderSuccess){
        return <PaymentSuccessPage paymentId={paymentId}/>
    }
    return(
        <React.Fragment>
            <Helmet>
                <title>Buy Connects | Modern Kaksha</title>
                <meta
                    name="description"
                    content="Buy Delta Eductors Connects. Start Connecting with tutors and students from all over the India and near you. Start teaching at your ease, near you or online. "
                />
            </Helmet>
            <div className={styles.choosePlanPage}>
                <div className={styles.imageContainer}></div>
                <div className={styles.headingHolder}><h2>Choose Your Plan</h2></div>
                <div className={styles.planCardHolder}>
                    <div className={`${styles.planCard} ${styles.silverCard}`}>
                        <div className={styles.topSec}>Silver</div>
                        <div className={styles.bottomSec}>
                            <div className={styles.priceContainer}><FontAwesomeIcon icon={faRupeeSign}/>250</div>
                            <div className={styles.specsContainer}>
                                <div className={styles.spec}><span className={styles.specValue}>10</span><span className={styles.specName}>Connects</span></div>
                                <div className={styles.spec}><span className={styles.specValue}>3</span><span className={styles.specName}>Months</span></div>
                            </div>
                            <div className={styles.selectBtn}>{!isLoading?<div onClick={()=>{selectPlan(10,'Silver',3,250)}}>Select</div>:<div className={styles.btnDisabled}>Loading...</div>}</div>
                        </div>
                    </div>
                    <div className={`${styles.planCard} ${styles.goldCard}`}>
                        <div className={styles.topSec}>Gold</div>
                        <div className={styles.bottomSec}>
                            <div className={styles.priceContainer}><FontAwesomeIcon icon={faRupeeSign}/>500</div>
                            <div className={styles.specsContainer}>
                                <div className={styles.spec}><span className={styles.specValue}>22</span><span className={styles.specName}>Connects</span></div>
                                <div className={styles.spec}><span className={styles.specValue}>5</span><span className={styles.specName}>Months</span></div>
                            </div>
                            <div className={styles.selectBtn}>{!isLoading?<div onClick={()=>{selectPlan(22,'Gold',5,500)}}>Select</div>:<div className={styles.btnDisabled}>Loading...</div>}</div>
                        </div>
                    </div>
                    <div className={`${styles.planCard} ${styles.platinumCard}`}>
                        <div className={styles.topSec}>Platinum</div>
                        <div className={styles.bottomSec}>
                            <div className={styles.priceContainer}><FontAwesomeIcon icon={faRupeeSign}/>1500</div>
                            <div className={styles.specsContainer}>
                                <div className={styles.spec}><span className={styles.specValue}>Unlimited</span><span className={styles.specName}>Connects</span></div>
                                <div className={styles.spec}><span className={styles.specValue}>3</span><span className={styles.specName}>Months</span></div>
                            </div>
                            <div className={styles.selectBtn}>{!isLoading?<div onClick={()=>{selectPlan(9999999,'Platinum',3,1500)}}>Select</div>:<div className={styles.btnDisabled}>Loading...</div>}</div>
                        </div>
                    </div>
                    {/* <div className={`${styles.planCard} ${styles.platinumCard}`}>
                        <div className={styles.topSec}>Platinum +</div>
                        <div className={styles.bottomSec}>
                            <div className={styles.priceContainer}><FontAwesomeIcon icon={faRupeeSign}/>2000</div>
                            <div className={styles.specsContainer}>
                                <div className={styles.spec}><span className={styles.specValue}>Unlimited</span><span className={styles.specName}>Connects</span></div>
                                <div className={styles.spec}><span className={styles.specValue}>6</span><span className={styles.specName}>Months</span></div>
                            </div>
                            <div className={styles.selectBtn}>{!isLoading?<div onClick={()=>{selectPlan(9999999,'Platinum+ ',6,2000)}}>Select</div>:<div className={styles.btnDisabled}>Loading...</div>}</div>
                        </div>
                    </div> */}
                    {/* <div className={`${styles.planCard} ${styles.platinumCard}`}>
                        <div className={styles.topSec}>Platinum ++</div>
                        <div className={styles.bottomSec}>
                            <div className={styles.priceContainer}><FontAwesomeIcon icon={faRupeeSign}/>3500</div>
                            <div className={styles.specsContainer}>
                                <div className={styles.spec}><span className={styles.specValue}>Unlimited</span><span className={styles.specName}>Connects</span></div>
                                <div className={styles.spec}><span className={styles.specValue}>12</span><span className={styles.specName}>Months</span></div>
                            </div>
                            <div className={styles.selectBtn}>{!isLoading?<div onClick={()=>{selectPlan(9999999,'Platinum++',12,3500)}}>Select</div>:<div className={styles.btnDisabled}>Loading...</div>}</div>
                        </div>
                    </div> */}
                    <div className={`${styles.planCard} ${styles.perlCard}`}>
                        <div className={styles.topSec}>Perl</div>
                        <div className={styles.bottomSec}>
                            <div className={styles.priceContainer}>__</div>
                            <div className={styles.specsContainer}>
                                <div className={styles.spec}><span className={styles.specValue}>__</span><span className={styles.specName}>Connects</span></div>
                                <div className={styles.spec}><span className={styles.specValue}>__</span><span className={styles.specName}>Months</span></div>
                            </div>
                            <div className={styles.selectBtn}><div>Select</div></div>
                        </div>
                        <div className={styles.blurCard}><div>Coming Soon</div></div>
                    </div>
                </div>
                
            </div>
        </React.Fragment>
    )
}

export default ChoosePlanPage;