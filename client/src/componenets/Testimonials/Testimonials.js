import React,{useEffect,useRef,useState,useContext} from "react";
import styles from './Testimonials.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import {userContext} from '../../context/userContext'

export default () => {
    const cardHolder=useRef();
    const {user,setBannerMsg}=useContext(userContext);

    let testimonials=[
        {
            content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente, necessitatibus autem nemo nam harum, veritatis reprehenderit nostrum ab eum aliquam obcaecati architecto. Modi inventore architecto rerum cum sapiente! Dignissimos, nulla.",
            userName:"John Doe",
            userType:"Tutor"
        },
        {
            content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente, necessitatibus autem nemo nam harum, veritatis reprehenderit nostrum ab eum aliquam obcaecati architecto. Modi inventore architecto rerum cum sapiente! Dignissimos, nulla.",
            userName:"John Doe",
            userType:"Tutor"
        },
        {
            content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente, necessitatibus autem nemo nam harum, veritatis reprehenderit nostrum ab eum aliquam obcaecati architecto. Modi inventore architecto rerum cum sapiente! Dignissimos, nulla.",
            userName:"John Doe",
            userType:"Tutor"
        }
    ]
    useEffect(()=>{
        Aos.init({duration:2000})
      },[]);

    return (
    <React.Fragment>
        <div className={user?styles.container:styles.containerBlack}>
            <h2 className={styles.title} >Testimonials</h2>
            <div className={styles.testimonialsContainer} id="testimonials">
                {testimonials.map((testimonial,i)=>(
                    <div className={styles.card} key={i} data-aos='flip-right' data-aos-delay={`${i*300}`} >
                        <div className={styles.mainContent}><span className={styles.opening}>&ldquo;</span> {testimonial.content}<span className={styles.closing}>&rdquo;</span></div>
                        <div className={styles.arrow}></div>
                        <div className={styles.userDetails}>
                            <div className={styles.userName}>{testimonial.userName}</div>
                            <div className={styles.userType}>{testimonial.userType}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    
    </React.Fragment>
    
    );
};
