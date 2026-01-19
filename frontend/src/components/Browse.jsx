import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import useGetAllJobs from "../hooks/useGetAllJobs";
import {motion} from 'framer-motion'


// const randomJobs = [1, 2, 3];
const Browse = () => {
  useGetAllJobs()
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
        dispatch(setSearchedQuery(""))
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Search Results ({allJobs.length})
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {allJobs.map((job) => {
            return (
              <motion.div
               className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
               initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
              >
                <Job key={job._id} job={job} />
              </motion.div>
              
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
