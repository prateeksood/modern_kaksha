import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const userContext = createContext();
export default props => {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [token,setToken] = useState(localStorage.getItem("token"));
  const [alertMsg,setAlertMsg] = useState(null);
  const [bannerMsg,setBannerMsg] = useState(null);
  useEffect(()=>{
    if(userLoaded){
    }
  },[userLoaded])

  useEffect(()=>{
    if(bannerMsg){
      if(!bannerMsg.timmer){
        window.setTimeout(()=>{
            setBannerMsg();
        },5000)
      }
    }
  },[bannerMsg])

  useEffect(() => {
    setUserLoaded(false)
    if (token) {
      let config = {
        headers: {
          "x-auth-token": token
        }
      };
      const fetchUser= async ()=>{
        try{
          const res= await axios.get(`${process.env.REACT_APP_API_URL}/auth/`, config);
          setUser(res.data.result);
          setUserLoaded(true);
        }
        catch(err){
            console.log(err);
            setBannerMsg({message:`Something went wrong!`});
        }
      }
      fetchUser();
    }else{
      setUserLoaded(true);
    }

  }, [token]);
  useEffect(()=>{
  },[user])
  return (
    <userContext.Provider value={{ user, setUser,setToken,setAlertMsg,alertMsg,userLoaded,bannerMsg,setBannerMsg}}>
      {props.children}
    </userContext.Provider>
  );
};
