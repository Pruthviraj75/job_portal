import axios from 'axios'
import React, { useEffect } from 'react'
import { SAVED_JOBS_API_ENDPOINT } from '../components/utils/constant'
// import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSavedJobs } from '../redux/savedJobSlice'

const useGetSavedJobs = () => {
    const dispatch = useDispatch()
  useEffect(() => {
    const fetchSavedJobs = async () => {
        try {
            const res = await axios.get(`${SAVED_JOBS_API_ENDPOINT}/get`,{withCredentials:true});
            // dispatch(setSavedJobs(res.data.jobs))
            if (res?.data?.success) {
  dispatch(setSavedJobs(res.data.jobs));
} else {
  dispatch(setSavedJobs([]));
}
        } 
        // catch (error) {
        //     console.log(error);
        // }
        catch (error) {
  console.log(error);
  dispatch(setSavedJobs([])); // ✅ ADD
}
    }
    fetchSavedJobs();
  }, [])
  
}

export default useGetSavedJobs
