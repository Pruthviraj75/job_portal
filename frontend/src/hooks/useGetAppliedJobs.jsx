import axios from 'axios'
import React, { useEffect } from 'react'
import { APPLICATION_API_ENDPOINT } from '../components/utils/constant'
import { setAllAppliedJobs } from '../redux/jobSlice'
import { useDispatch } from 'react-redux'

const useGetAppliedJobs = () => {
  const dispatch = useDispatch() 
  useEffect(() => {
    const fetchAllAppliedJobs = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`,{withCredentials:true});
            // if(res.data.success){
            //     dispatch(setAllAppliedJobs(res.data.application))
            // }
            if (res?.data?.success) {
  dispatch(setAllAppliedJobs(res.data.application));
} else {
  dispatch(setAllAppliedJobs([]));
}
        } 
        // catch (error) {
        //     console.log(error);
        // }
        catch (error) {
  console.log(error);
  dispatch(setAllAppliedJobs([])); // ✅ ADD
}
    } 
    fetchAllAppliedJobs();
  }, [])
  
}

export default useGetAppliedJobs
