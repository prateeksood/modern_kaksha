import React, { useEffect, useState } from "react";
import Aos from 'aos';
import styles from './searchTutorSection.module.scss';
import {subjects} from '../../data/data';
import Select from 'react-dropdown-select';
import { Redirect } from "react-router-dom";

export default () => {
  const [pincode,setPincode]=useState();
  const [subjectList,setSubjectList]=useState([]);
  const [startSearch,setStartSearch]=useState(false);
  const pincodeChangeHandler=(e)=>{
      setPincode(e.target.value)
  }
 const onSubjectChange=(subjects)=>{
   let arr=subjects.map(subject=>subject.value)
  setSubjectList(arr);
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
                    <div className={styles.searchSecHead}><span className={styles.mainText}>Find Tutors</span ><span className={styles.followText}>Near You</span></div>
                    <div className={styles.pinCode}><input type="number" placeholder="Pincode" onChange={pincodeChangeHandler}/></div>
                    <div className={styles.subjects}>
                          <Select
                            multi
                            options={subjects}
                            onChange={onSubjectChange}
                            color="#2876A0"
                          />

                    </div>
                    <div className={styles.searchBtn}><div onClick={handleSearch}>Search</div></div>
                </div>
            </div>
      </div>
    </React.Fragment>
    
  );
};
