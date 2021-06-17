import {Helmet} from "react-helmet";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import AuthForm from '../AuthForm/authForm'
import styles from './paymentSuccessPage.module.scss'
const PaymentSuccessPage= (props)=> {
    const [timmer,setTimmer]=useState(5);
    let paymentId=props.paymentId||'';

    useEffect(()=>{
        if(timmer>0){
            window.setTimeout(()=>{
                setTimmer(prev=>prev-1);
            },1000);
        }
    },[timmer])

    if(timmer===0){
        return <Redirect to='/'/>
    }
    return (
        <div className={styles.paymentSuccessPage}>
            <Helmet>
                <title>Payment Success | Modern Kaksha</title>
                <meta
                    name="description"
                    content="Payment Successful "
                />
            </Helmet>
            <h2>Payment Successful</h2>
            <div className={styles.paymentDetails}>
                <div className={styles.heading}>Payment Id: </div>
                <span>{paymentId}</span>
            </div>
            <p> You will be redirected in {timmer} seconds</p>
        </div>
    );
}
export default PaymentSuccessPage;