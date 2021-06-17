import React,{useEffect,useRef,useState} from "react";
import styles from './subjectsCarousel.module.scss';
import Aos from 'aos';
import 'aos/dist/aos.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask,faCalculator,faGuitar,faArrowAltCircleLeft,faArrowAltCircleRight,faPalette, faFont, faBrain, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { subjects } from "../../data/data";
import { Redirect } from "react-router-dom";

export default () => {
    const [subjectList,setSubjectList]=useState([]); 
    const cardHolder=useRef();
    const handleClick=(title)=>{
        setSubjectList([{value:title}]);
    }
    let cards=[
        { 
            icon:faFlask,
            title:'Science'},
        { 
            icon:faCalculator,
            title:'Mathematics'
        },
        { 
            icon:faGuitar,
            title:'Guitar'
        },
        {
            icon:faFont,
            title:'English Speaking'
        },
        {
            icon:faBrain,
            title:'Psychology'
        },
        {
            icon:faPalette,
            title:'Art and Craft'
        }
    ]

    const goRight=()=>{
        cardHolder.current.scrollLeft+=300;
    }
    const goRightMobile=()=>{
        cardHolder.current.scrollLeft+=265;
    }
    const goLeft=()=>{
        cardHolder.current.scrollLeft-=300;
    }
    const goLeftMobile=()=>{
        cardHolder.current.scrollLeft-=265;
    }
    useEffect(()=>{
        Aos.init({duration:2000})
      },[])
    
    if(subjectList.length>0){
        return <Redirect to={{
            pathname:'/connect',
            state:{subjectList:subjectList}
        }}/>
    }
    return (
    <React.Fragment>
    <div className={styles.quickLinks} id="quickLinks"> 
        <h2 className={styles.quickLinksTitle} >Quick Links</h2>
        <div className={styles.carousel}>
        <div onClick={goLeft} className={styles.arrow}><FontAwesomeIcon icon={faArrowAltCircleLeft}/></div>
        <div onClick={goLeftMobile} className={styles.arrowMobile}><FontAwesomeIcon icon={faAngleLeft}/></div>
            <div className={styles.cardHolder} ref={cardHolder}>
                {cards.map((card,i)=>(
                    <div key ={i} className={styles.card} data-aos='fade-in' data-aos-delay={`${i*200}`} onClick={()=>handleClick(card.title)}>
                        <div className={styles.cardIcon}><FontAwesomeIcon icon={card.icon}/></div>
                        <div className={styles.cardTitle}>{card.title}</div>
                    </div>
                ))} 
            </div>
            <div onClick={goRight} className={styles.arrow}><FontAwesomeIcon icon={faArrowAltCircleRight}/></div>
            <div onClick={goRightMobile} className={styles.arrowMobile}><FontAwesomeIcon icon={faAngleRight}/></div>
        </div>
    </div>
    </React.Fragment>
    
    );
};
