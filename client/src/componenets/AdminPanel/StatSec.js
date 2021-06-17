import React, { useEffect, useState,useContext, useMemo} from 'react';
import axios from 'axios';
import {userContext} from '../../context/userContext'
import styles from './adminPanel.module.scss';
// import localStyles from './StatSec.scss';

const StatSec= (props)=> {

    const {setBannerMsg,user,userLoaded,setAlertMsg}=useContext(userContext);
    const [isLoading,setIsLoading]=useState(1);
    const [studentsCount,setStudentsCount]=useState(0);
    const [tutorsCount,setTutorsCount]=useState(0);
    const [messagesCount,setMessagesCount]=useState(0);
    const [ordersCount,setOrdersCount]=useState(0);
    let [cards,setCards] = useState([
        {
          title: "Students' Ads",
          id: "card1",
          url: "/api/students/",
          method:"post",
          data: {
            feesPeriod: "allfees",
            pincodes: [],
            minimumFees: 0,
            maximumFees: 500000,
            subjects: [],
            pageNumber: 1,
            pageSize: 100000,
          },
        },
        {
            title: "Tutors' Ads",
            id: "card2",
            url: "/api/teachers/",
            method:"post",
            data: {
              feesPeriod: "allfees",
              pincodes: [],
              minimumFees: 0,
              maximumFees: 500000,
              subjects: [],
              pageNumber: 1,
              pageSize: 100000,
            },
        },
        {
            title: "Messages",
            id: "card3",
            url: "/api/messages",
            method:"get",
            data: {}
        },
        {
            title: "Orders",
            id: "card4",
            url: "/api/orders",
            method:"get",
            data: {}
        },
    ]);
    
    useEffect(()=>{
        const fetchStudents=async (i)=>{
            setIsLoading(true);
            try{
                // const res= await axios.post(cards[i].url,cards[i].data);
                const res=await axios({
                    method: cards[i].method,
                    url: cards[i].url,
                    data: cards[i].data
                  });
                if(!res.data.error){
                    return (res.data.result.length);
                }
            }
            catch(err){
                console.log(err);
                setBannerMsg({message:`Something went wrong!`});
                setIsLoading(false)
                return 0;
            }
            finally{
                setIsLoading(false)
            }     
        }
        cards.forEach(async (card,i)=>{
                let res=await fetchStudents(i);
                if(i===0)
                    setStudentsCount(res);
                else if(i===1)
                    setTutorsCount(res);
                else if(i===2)
                    setMessagesCount(res);
                else if(i===3)
                    setOrdersCount(res);
        })
    },[cards, setBannerMsg]);
    
    
    return (
        <React.Fragment>
            <div>
                <h1 className={styles.heading}>Statistics</h1>
                <div className={styles.summaryMainSection}>
                    {
                        cards.map((card,key)=>{
                            return(
                                <div className={styles.card} id={styles[card.id]} key={key}>
                                    {key===0&&<div className={styles.cardNumber}>{studentsCount}</div>}
                                    {key===1&&<div className={styles.cardNumber}>{tutorsCount}</div>}
                                    {key===2&&<div className={styles.cardNumber}>{messagesCount}</div>}
                                    {key===3&&<div className={styles.cardNumber}>{ordersCount}</div>}
                                    <div className={styles.cardTitle}>{card.title}</div>
                                </div>
                            )
                        })
                    }
                    
                    {/* <div className={styles.card}  id={styles.card2}>
                        <div className={styles.cardNumber}>90</div>
                        <div className={styles.cardTitle}>Tutors</div>
                    </div>
                    <div className={styles.card}  id={styles.card3}>
                        <div className={styles.cardNumber}>165</div>
                        <div className={styles.cardTitle}>Subjects</div>
                    </div>
                    <div className={styles.card}  id={styles.card4}>
                        <div className={styles.cardNumber}>3</div>
                        <div className={styles.cardTitle}>Messages</div>
                    </div>
                    <div className={styles.card}  id={styles.card5}>
                        <div className={styles.cardNumber}>5</div>
                        <div className={styles.cardTitle}>Orders</div>
                    </div> */}
                </div>
            </div>
        </React.Fragment>
  );
}

export default StatSec;