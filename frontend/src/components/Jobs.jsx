import React, { useEffect, useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";
import {motion} from 'framer-motion'

const Jobs = () => {
  const {allJobs, searchedQuery} = useSelector(store=>store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs)
  useEffect(() => {
      if(searchedQuery){
          const filteredJobs = allJobs.filter((job)=>{
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.salary.toString().includes(searchedQuery)
          });
          setFilterJobs(filteredJobs)
      } else {
        setFilterJobs(allJobs)
      }
  }, [allJobs, searchedQuery])
  
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-20">
        <div className="flex gap-5">
          <div className="w-20%">
            {/* Filter Page */}
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? ( <span>Jobs Not Found</span> ) 
          : ( <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            <div className="grid grid-cols-3 gap-4">
              {/* Job Cards */}
              {filterJobs.map((job) => (
                <motion.div 
                className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                key={job._id}>
                    <Job job={job} />
                </motion.div>
              ))}
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
