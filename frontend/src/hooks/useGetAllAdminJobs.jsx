import { setAllAdminJobs } from "../redux/jobSlice";
import { Job_API_ENDPOINT } from "../components/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${Job_API_ENDPOINT}/getadminjobs`, { withCredentials: true });
        // if (res.data.success) {
        //   dispatch(setAllAdminJobs(res.data.jobs));
        // }
        if (res?.data?.success) {
  dispatch(setAllAdminJobs(res.data.jobs));
} else {
  dispatch(setAllAdminJobs([]));
}
      } 
      // catch (error) {
      //   console.log(error);
      // }
      catch (error) {
  console.log(error);
  dispatch(setAllAdminJobs([])); // ✅ ADD THIS
}
    };
    fetchAllAdminJobs();
  }, []);
};

export default useGetAllAdminJobs;
