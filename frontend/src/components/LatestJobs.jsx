import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import {motion} from 'framer-motion'

// const randomJobs = [1,2,3,4,5,6,7,8];
const LatestJobs = () => {
  const {allJobs} = useSelector(store=>store.job)
  return (
    <div className='max-w-7xl mx-auto my-20'>
      <h1 className='text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top </span>Job openings</h1>
      <div className='grid grid-cols-3 gap-4 my-5'
      
      >
         {
            allJobs.length <= 0 ? <span>No Jobs Available</span> : allJobs?.slice(0,6).map((job) =>(
              <motion.div key={job._id}
              className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
               initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
              >
                 <LatestJobCards key={job._id} job={job}/>
              </motion.div>
            ))
         }
         {/* {Array.isArray(allJobs) && allJobs.length > 0 ? (
          allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))
        ) : (
          <span>No Jobs Available</span>
        )} */}
      </div>
      
    </div>
  )
}

export default LatestJobs
