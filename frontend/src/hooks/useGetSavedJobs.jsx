import axios from 'axios'
import React, { useEffect } from 'react'
import { SAVED_JOBS_API_ENDPOINT } from '../components/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSavedJobs } from '../redux/savedJobSlice'

const useGetSavedJobs = () => {
    const dispatch = useDispatch()
  useEffect(() => {
    const fetchSavedJobs = async () => {
        try {
            const res = await axios.get(`${SAVED_JOBS_API_ENDPOINT}/get`,{withCredentials:true});
            dispatch(setSavedJobs(res.data.jobs))
        } catch (error) {
            console.log(error);
        }
    }
    fetchSavedJobs();
  }, [])
  
}

export default useGetSavedJobs
