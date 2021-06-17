import React,{useEffect, useState,useContext} from "react";
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import { userContext } from "../../context/userContext";
import useForm from '../../hooks/useForm'
import validationRules from '../../validationRules/tutorInfoFormValidationRules'
import Select from 'react-dropdown-select';
import {motion} from 'framer-motion';
import {subjects,studentClasses} from '../../data/data'
import 'aos/dist/aos.css'
import styles from '../AuthForm/authForm.module.scss'

const TutorInfoForm= ({formType, setFormType,backUrl,isEditProfileForm})=> {
    const [district,setDistrict]=useState();
    const [state,setState]=useState();
    const [studyingMode,setStudyingMode]=useState('online');
    const [subjectList,setSubjectList]=useState([])
    const [studentClass,setStudentClass]=useState();
    const [localErrors,setLocalErrors]=useState({});
    const [isLoading,setIsLoading]=useState(false);
    const [isSubmited,setIsSubmited]=useState(false);
    const [areLocationsLoading,setAreLocationsLoading]=useState(false);
    const {setUser,setAlertMsg,userLoaded,user,setBannerMsg} = useContext(userContext);

    const onStudentClassChange=(classes) =>{
        setStudentClass(classes[0]);
        setLocalErrors(prev=>({...prev,studentClassesDropdwn:''}))
    }
    const onSubjectChange=(subjects)=>{
        setSubjectList(subjects);
        setLocalErrors(prev=>({...prev,subjectDropdown:''}))
    }
    const pincodeChangeHandler=(e)=>{
        handleChange(e);
        if(e.target.value.length===6){
            setAreLocationsLoading(true)
            const targetPins=[parseInt(e.target.value)+1,parseInt(e.target.value),parseInt(e.target.value)-1]
            targetPins.forEach((pin,i)=>{
                axios.get(`https://api.postalpincode.in/pincode/${pin}`)
                .then(res=>{
                    if(res.data[0].Status==="Success"){
                        setDistrict(`${res.data[0].PostOffice[0].Block},${res.data[0].PostOffice[0].District}`);
                        setState(res.data[0].PostOffice[0].State)
                    }
                    else{
                        if(i===1){
                            setAlertMsg({message:`Invalid pincode ${pin}`});
                        }
                    }
                    setAreLocationsLoading(false)
                })
                .catch(err=>console.log(err))
            })
            
        }
    }
    const submitHandler = async () => {
        
        if(values.pincode.length===6){
            setIsLoading(true);
            const targetPins=[parseInt(values.pincode)+1,parseInt(values.pincode),parseInt(values.pincode)-1]
            targetPins.forEach((pin,i)=>{
                axios.get(`https://api.postalpincode.in/pincode/${pin}`)
                .then(res=>{
                    if(res.data[0].Status==="Success"){
                        setDistrict(`${res.data[0].PostOffice[0].Block},${res.data[0].PostOffice[0].District}`);
                        setState(res.data[0].PostOffice[0].State)
                    }
                    else{
                        if(i===1){
                            setAlertMsg({message:`Invalid pin ${pin}`});
                            setLocalErrors(prev=>({...prev,pincode:'Invalid Pincode'}));
                            return
                        }
                    }
                })
                .catch(err=>console.log(err))
            })
            setIsLoading(false);
        }
        if(subjectList.length===0){
            setLocalErrors(prev=>({...prev,subjectDropdown:'Select atleast one subject'}));
            return
        }
        if(!studentClass){
            setLocalErrors(prev=>({...prev,studentClassesDropdwn:'Select your Class'}));
            return
        }
        const data = {
            _id:user._id,
            studyingMode:studyingMode,
            pincode:values.pincode,
            subjects:subjectList,
            discription:values.discription,
            classOfStudy:studentClass,
            isStepOneDone:true,
            isActive:true,
            district:district,
            state:state
        };
        try{
            setIsLoading(true);
            const res = await axios.put(`/api/students/update`,data,{headers:{'x-auth-token':localStorage.getItem("token")}});
            if(!res.data.error){
                setUser(res.data.result);
                setIsSubmited(true);
            }
            else {
                setAlertMsg({message:res.data.error});
            }
        }
        catch(err){
            console.log(err);
            setBannerMsg({message:`Something went wrong!`});
        }
        finally{
            setIsLoading(false)
        }
        setIsLoading(false);
    };
    const changeStudyingMode=(e)=>{
        setStudyingMode(e.target.value);
    }
    const { values, errors, handleChange, handleSubmit,setValues} = useForm(
        submitHandler,
        validationRules
    );
    useEffect(()=>{
        if(user&&isEditProfileForm){
            setValues({...user})
            setStudentClass(user.classOfStudy);
            setSubjectList(user.subjects);
            setStudyingMode(user.studyingMode);
        }
    },[setValues,user,isEditProfileForm])
    if(isSubmited&&!isLoading){
        if(!isEditProfileForm){
            alert(`Thank You for completing your registration. As a token of gratitude we are giving you 5 free credits and we have posted a free ad for you.`)
        }
        return(<Redirect to={backUrl||'/connect'}/>)
    }
    return (
        <React.Fragment>
                <motion.form initial={{opacity:0,x:-300}} animate={{opacity:1,x:0}} onSubmit={handleSubmit}>
                    <h3>{isEditProfileForm?`Edit Profile`:`Few more steps`}</h3>
                    <div className={styles.inputContainer}>
        {/*======================== Studying place  radio buttons===========================*/}
                        <div className={styles.radioLabelHolder}><label htmlFor='studyingLocation'>Where would you like to study?</label></div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="studyingLocation"
                                id="online"
                                value="online"
                                checked={studyingMode==='online'}
                                onChange={changeStudyingMode}
                            />
                            <label htmlFor='online'>Online</label>
                        </div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="studyingLocation"
                                id="student-place"
                                value="student"
                                checked={studyingMode==='student'}
                                onChange={changeStudyingMode}
                            />
                            <label htmlFor='student-place'>At your place</label>
                        </div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="studyingLocation"
                                id="teacher-place"
                                value="teacher"
                                checked={studyingMode==='teacher'}
                                onChange={changeStudyingMode}
                            />
                            <label htmlFor='teacher-place'>At teacher's place / Institute</label>
                        </div>
                {/* =================================Pincode section===================================== */}
                        <div className={styles.inputHolder}>
                            <label htmlFor='pincode'>Pincode</label>
                            <input
                                type="number"
                                className={`${errors.pincode? styles.validationError:styles.inputBox}`}
                                name="pincode"
                                id="pincode"
                                placeholder=""
                                value={values.pincode || ""}
                                onChange={pincodeChangeHandler}
                            />
                            <div className={styles.errorMsg}>{errors.pincode||localErrors.pincode}</div>
                        </div>
                {/* ========================== Subjects dropdown======================= */}
                        <div className={styles.dropdownHolder}>
                            <label>Select subjects you want to study</label>
                            <Select
                                multi
                                create
                                options={subjects}
                                onChange={onSubjectChange}
                                color="#2876A0"
                                labelField='value'
                                values={subjectList}
                                sortBy='value'
                            />
                            <div className={styles.errorMsg}>{localErrors.subjectDropdown}</div>
                        </div>
                {/* =================================Discription section===================================== */}
                        <div className={styles.inputHolder}>
                            <label htmlFor='discripton'>Discription (Optional)</label>
                            <input
                                type="text"
                                className={`${errors.discription? styles.validationError:styles.inputBox}`}
                                name="discription"
                                id="discription"
                                placeholder="A precise discription of what you want to study."
                                value={values.discription || ""}
                                onChange={handleChange}
                            />
                            <div className={styles.errorMsg}>{errors.discription}</div>
                        </div>
                {/* ============================Class drop down=================== */}
                    <div className={styles.dropdownHolder}>
                        <label>Select your class</label>
                        <Select
                            options={studentClasses}
                            onChange={onStudentClassChange}
                            color="#2876A0"
                            labelField='value'
                            values={studentClass}
                        />
                        <div className={styles.errorMsg}>{localErrors.studentClassesDropdwn}</div>
                    </div>
                    
                {/* ==========================Submit button============================= */}
                        <div className={styles.inputHolder}>
                                <input
                                    type="submit"
                                    className={`${styles.inputBox}`}
                                    value={isLoading||areLocationsLoading?`Loading...`:`Proceed`}
                                    disabled={isLoading||areLocationsLoading}
                                />
                        </div>
                    </div>                    
                </motion.form>
    </React.Fragment>
  );
}
export default TutorInfoForm;
