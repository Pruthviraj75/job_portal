import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { Job_API_ENDPOINT } from "../components/utils/constant";

const useGetJobById = (jobId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${Job_API_ENDPOINT}/${jobId}`);

        // if (res.data.success) {
        //   dispatch(setSingleJob(res.data.job));
        // }
        if (res?.data?.success) {
  dispatch(setSingleJob(res.data.job));
} else {
  dispatch(setSingleJob(null));
}
      } 
      // catch (error) {
      //   console.log(error);
      // }
      catch (error) {
  console.log(error);
  dispatch(setSingleJob(null)); // ✅ ADD
}
    };

    if (jobId) fetchJob();
  }, [jobId, dispatch]);
};

export default useGetJobById;
