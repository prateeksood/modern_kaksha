import React, { useEffect, useState,useContext } from "react";
import Aos from 'aos';
import {userContext} from '../../context/userContext';
import styles from './searchTutorSection.module.scss';
import {subjects} from '../../data/data';
import Select from 'react-dropdown-select';
import { Redirect } from "react-router-dom";

export default () => {
  const {userLoaded,user,setAlert,setBannerMsg,setUser } = useContext(userContext);
  const [pincode,setPincode]=useState();
  const [subjectList,setSubjectList]=useState([]);
  const [startSearch,setStartSearch]=useState(false);
  const pincodeChangeHandler=(e)=>{
      setPincode(e.target.value)
  }
 const onSubjectChange=(subjects)=>{
    setSubjectList(subjects);
 }

  const handleSearch=()=>{
    setStartSearch(true);
  }
  useEffect(()=>{
    Aos.init({duration:2000})
  },[])

  if(startSearch){
    return <Redirect to={{pathname:'/connect', state:{pincode:pincode,subjectList:subjectList}}}/>
  }

  return (
    <React.Fragment>
      <div className={styles.searchTutorSection} id='search-bar'>
            <div  data-aos='zoom-in'>
                <div className={styles.searchHolder}>
                    <div className={styles.searchSecHead}><span className={styles.mainText}>{userLoaded&&user&&user.accountType==='teacher'? 'Find Students':'Find Tutors'}</span ><span className={styles.followText}>Near You</span></div>
                    <div className={styles.pinCode}><input type="number" placeholder="Pincode" onChange={pincodeChangeHandler}/></div>
                    <div className={styles.subjects}>
                          <Select
                            multi
                            create
                            options={subjects}
                            onChange={onSubjectChange}
                            color="#2876A0"
                            labelField='value'
                            sortBy='value'
                            dropdownPosition='top'
                            placeholder='Subject'
                          />

                    </div>
                    <div className={styles.searchBtn}><div onClick={handleSearch}>Search</div></div>
                </div>
            </div>
      </div>
    </React.Fragment>
    
  );
};
