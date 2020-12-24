import React,{useEffect, useState,useContext} from "react";
import { userContext } from "../../context/userContext";
import axios from 'axios'
import useForm from '../../hooks/useForm'
import validationRules from '../../validationRules/tutorInfoFormValidationRules'
import { Multiselect } from 'multiselect-react-dropdown';
import Select from 'react-dropdown-select';
import {motion} from 'framer-motion';
import {subjects,levelOfEducation,classGroupsList} from '../../data/data'
import 'aos/dist/aos.css'
import styles from '../AuthForm/authForm.module.scss'

const TutorInfoForm= ({formType, setFormType})=> {
    const [nearAroundLocations,setNearAroundLocations]=useState([]);
    const [district,setDistrict]=useState();
    const [state,setState]=useState();
    const [teachingMode,setTeachingMode]=useState('online');
    const [subjectList,setSubjectList]=useState([]);
    const [classGroups,setClassGroups]=useState([]);
    const [areLocationsLoading,setAreLocationsLoading]=useState(false);
    const [requirementOfCertificate, setRequirementOfCertificate]=useState(false);
    const [highestEducation, setHighestEducation]=useState();
    const [teachingLocation,setTeachingLocation]=useState([]);
    const [localErrors,setLocalErrors]=useState({});
    const [educationCertificateFile,setEducationCertificateFile]=useState();
    const [isInfoCaptured,setIsInfoCaptured]=useState(false)
    const [isLoading,setIsLoading]=useState(false);
    const {setUser,setAlertMsg,userLoaded,user,setBannerMsg } = useContext(userContext);

    useEffect(()=>{
        if(isInfoCaptured){
            setFormType('tutorFeeDetailForm')
        }
    },[isInfoCaptured,setFormType])

    const onLevelOfEducationChange=(education) =>{
        setHighestEducation(education[0].value);
        setLocalErrors(prev=>({...prev,highestEducationDropdwn:''}))
    }
    const onTeachingLocationChange=(locations)=> {
        let arr=locations.map(location=>location.value);
        setTeachingLocation(arr);
        setLocalErrors(prev=>({...prev,teachingLocationDropdown:''}));
    }
    const onSubjectChange=(subjects)=>{
        let arr=subjects.map(subject=>subject.value)
        setSubjectList(arr);
        setLocalErrors(prev=>({...prev,subjectDropdown:''}));
    }

    const onClassGroupsChange=(classeGroups)=>{
        let arr=classeGroups.map(classGroup=>classGroup.value)
        setClassGroups(arr);
        setLocalErrors(prev=>({...prev,classGroupDropdown:''}))
    }

    const submitHandler = async () => {
        if(subjectList.length===0){
            setLocalErrors(prev=>({...prev,subjectDropdown:'Select atleast one subject'}));
            return
        }
        if(classGroups.length===0){
            setLocalErrors(prev=>({...prev,classGroupDropdown:'Select atleast one class group'}));
            return
        }
        if(requirementOfCertificate&&!highestEducation){
            setLocalErrors(prev=>({...prev,highestEducationDropdwn:'Select you highest level of education'}));
            return
        }
        if(teachingLocation.length===0&&teachingMode!=='online'){
            setLocalErrors(prev=>({...prev,teachingLocationDropdown:'Select atleast one location'}))
            return
        }
        if(requirementOfCertificate&&(!educationCertificateFile)){
            setLocalErrors(prev=>({...prev,certificateUpload:'Kindly upload you certificate'}))
            return
        }
        setIsLoading(true);
        let formData=new FormData();
        
        formData.append('_id',user._id);
        formData.append('aadharNumber',values.aadhar);
        formData.append('teachingMode',teachingMode);
        // values.pincode&&
        formData.append('pincode',values.pincode);
        formData.append('district',district);
        formData.append('state',state);
        teachingLocation.forEach(location=>{
            formData.append('teachingLocation',location);
        })
        values.instituteName&&formData.append('instituteName',values.instituteName);
        values.address&&
            formData.append('address',values.address);
        subjectList.forEach(subject=>{
            formData.append('subjects[]',subject);
        })
        classGroups.forEach(classGroup=>{
            formData.append('classGroups[]',classGroup);
        })
        formData.append('requirementOfCertificate',requirementOfCertificate);
        requirementOfCertificate&&
            formData.append('highestLevelOfEducation',highestEducation);
        formData.append('isStepOneDone',true);
        requirementOfCertificate&&
            formData.append('educationCertificateFile',educationCertificateFile);
        try{
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'x-auth-token':localStorage.getItem("token")
                }
            };
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/teachers/update`,formData,config);
            if(!res.data.error){
                setUser(res.data.result);
                setIsInfoCaptured(true);
            }
            else {
                setAlertMsg({message:res.data.error});
            }
        }
        catch(err){
            console.log(err);
            setBannerMsg({message:`Something went wrong!`});
        } 
        setIsLoading(false)
    };
    const changeTeachingMode=(e)=>{
        setTeachingMode(e.target.value);
        if(e.target.value==='online'){
            clearValue('instituteName');
            clearValue('address');
            setLocalErrors(prev=>({...prev,teachingLocationDropdown:''}));
        }else if(e.target.value==='student'||e.target.value==='teacher'){
            clearValue('instituteName');
        }
    }
    const changeRequirementOfCertificate=(e)=>{
        setRequirementOfCertificate(prev=>!prev)
        if(e.target.value==='no'){
            setLocalErrors(prev=>({...prev,certificateUpload:''}));
        }
    }
    const updateFileName=(e)=>{
        setEducationCertificateFile(e.target.files[0])
        if(e.target.files.length>0){
            setLocalErrors(prev=>({...prev,certificateUpload:''}))
        }
    }
    const pincodeChangeHandler=(e)=>{
        handleChange(e);
        setNearAroundLocations([])
        if(e.target.value.length===6){
            setAreLocationsLoading(true)
            const targetPins=[parseInt(e.target.value)+1,parseInt(e.target.value),parseInt(e.target.value)-1]
            targetPins.forEach((pin,i)=>{
                axios.get(`https://api.postalpincode.in/pincode/${pin}`)
                .then(res=>{
                    if(res.data[0].Status==="Success"){
                        setDistrict(`${res.data[0].PostOffice[0].Block},${res.data[0].PostOffice[0].District}`);
                        setState(res.data[0].PostOffice[0].State)
                        res.data[0].PostOffice.forEach((location,i)=>{
                            setNearAroundLocations(prev=>[...prev,{id:(prev.length+1),value:location.Name,label:location.Name}])
                        })
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
    const { values, errors, handleChange, handleSubmit, clearValue } = useForm(
        submitHandler,
        validationRules
    );
  return (
    <React.Fragment>
                <motion.form initial={{opacity:0,x:-300}} animate={{opacity:1,x:0}} onSubmit={handleSubmit}>
                    <h3>Few more steps</h3>
                    <div className={styles.inputContainer}>


        {/* =============================Aadhar Number Textbox=============================== */}
                        <div className={styles.inputHolder}>
                            <label htmlFor='aadhar'>Aadhaar Number</label>
                            <input
                                type="number"
                                className={`${errors.aadhar? styles.validationError:styles.inputBox}`}
                                name="aadhar"
                                id="aadhar"
                                placeholder=""
                                value={values.aadhar || ""}
                                onChange={handleChange}
                            />
                             <div className={styles.errorMsg}>{errors.aadhar}</div>
                        </div>
                        
        {/*======================== Teaching place  radio buttons===========================*/}
                        <div className={styles.radioLabelHolder}><label htmlFor='teachingLocation'>Where would you like to teach ? </label></div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="teachingLocation"
                                id="online"
                                value="online"
                                checked={teachingMode==='online'}
                                onChange={changeTeachingMode}
                            />
                            <label htmlFor='online'>Online</label>
                        </div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="teachingLocation"
                                id="student-place"
                                value="student"
                                checked={teachingMode==='student'}
                                onChange={changeTeachingMode}
                            />
                            <label htmlFor='student-place'>At student's place</label>
                        </div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="teachingLocation"
                                id="teacher-place"
                                value="teacher"
                                checked={teachingMode==='teacher'}
                                onChange={changeTeachingMode}
                            />
                            <label htmlFor='teacher-place'>At your place</label>
                        </div>
                        <div className={styles.radioBtnHolder}>
                        <input
                                type="radio"
                                name="teachingLocation"
                                id="institute"
                                value="institute"
                                checked={teachingMode==='institute'}
                                onChange={changeTeachingMode}
                            />
                            <label htmlFor='institute'>At your institute</label>
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
                            <div className={styles.errorMsg}>{errors.pincode}</div>
                        </div>
                {/* ===================================Teaching locations================================*/}
                    {teachingMode!=='online'&&
                        <div className={styles.dropdownHolder}>
                            <label>Select the localities you can teach students from</label>
                            <Select
                                multi
                                options={nearAroundLocations}
                                onChange={onTeachingLocationChange}
                                loading={areLocationsLoading}
                                color="#2876A0"
                            />
                            <div className={styles.errorMsg}>{localErrors.teachingLocationDropdown}</div>
                        </div>
                    }
                {/* ================= Institute Name================= */}
                    {teachingMode==='institute'&&
                        <div className={styles.inputHolder}>
                            <label htmlFor='institute-name'>Institute Name</label>
                            <input
                                type="text"
                                className={`${errors.instituteName? styles.validationError:styles.inputBox}`}
                                name="instituteName"
                                id="institute-name"
                                placeholder=""
                                value={values.instituteName|| ""}
                                onChange={handleChange}
                                />
                            <div className={styles.errorMsg}>{errors.instituteName}</div>
                        </div>
                    }
                {/* ================= Full Address of tutor===================== */}
                    {teachingMode!=='online'&&
                        <div className={styles.inputHolder}>
                            <label htmlFor='address'>Address</label>
                            <input
                                type="text"
                                className={`${errors.address? styles.validationError:styles.inputBox}`}
                                name="address"
                                id="address"
                                value={values.address|| ""}
                                onChange={handleChange}
                            />
                            <div className={styles.errorMsg}>{errors.address}</div>
                        </div>
                    }
                {/* ========================== Subjects dropdown======================= */}
                        <div className={styles.dropdownHolder}>
                            <label>Select subjects you can teach</label>
                            <Select
                                multi
                                options={subjects}
                                onChange={onSubjectChange}
                                color="#2876A0"
                            />
                            <div className={styles.errorMsg}>{localErrors.subjectDropdown}</div>
                        </div>
                {/* ========================== Class Groups Dropdown======================= */}
                        <div className={styles.dropdownHolder}>
                            <label>Select classes you can teach</label>
                            <Select
                                multi
                                options={classGroupsList}
                                onChange={onClassGroupsChange}
                                color="#2876A0"
                            />
                            <div className={styles.errorMsg}>{localErrors.classGroupDropdown}</div>
                        </div>

                {/* ===========================Certifcate of experience radio btn ============================== */}
                        {/* <div className={styles.radioLabelHolder}><label htmlFor='certificateOfXP'>Do you want certificate of experience?</label></div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="certificateOfXP"
                                id="certificate-yes"
                                value="yes"
                                checked={requirementOfCertificate}
                                onChange={changeRequirementOfCertificate}
                            />
                            <label htmlFor='certificate-yes'>Yes (Rs. 100 fees)</label>
                        </div>
                        <div className={styles.radioBtnHolder}>
                            <input
                                type="radio"
                                name="certificateOfXP"
                                id="certificate-no"
                                value="no"
                                checked={!requirementOfCertificate}
                                onChange={changeRequirementOfCertificate}
                            />
                            <label htmlFor='certificate-no'>No</label>
                        </div> */}
                {/* ============================Highest education drop down=================== */}
                    {requirementOfCertificate&&  
                        <div className={styles.inputHolder}>
                            <label>Select your highest level of education</label>
                            <Select
                                options={levelOfEducation} 
                                onChange={onLevelOfEducationChange}
                                color="#2876A0"
                            />
                            <div className={styles.errorMsg}>{localErrors.highestEducationDropdwn}</div>
                        </div>
                    }
                {/*============================Upload Education Certificate======================  */}
                    {(requirementOfCertificate&& highestEducation)&&
                        <div className={styles.inputHolder}>
                            <label htmlFor='educationCertificateFile'> Upload your {highestEducation} certificate (pdf)</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                className={`${errors.address? styles.validationError:styles.inputBox}`}
                                name='educationCertificateFile'
                                id="educationCertificateFile"
                                onChange={updateFileName}
                            />
                            <div className={styles.errorMsg}>{localErrors.certificateUpload}</div>
                        </div>
                    }
                {/* ==========================Submit button============================= */}
                        <div className={styles.inputHolder}>
                                <input
                                    type="submit"
                                    className={`${styles.inputBox}`}
                                    value={isLoading?`Loading...`:`Proceed`}
                                    disabled={isLoading}
                                />
                        </div>
                    </div>                    
                </motion.form>
    </React.Fragment>
  );
}
export default TutorInfoForm;
