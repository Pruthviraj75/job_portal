import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-white">
      {/* Section Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Discover the most recent opportunities from top companies
        </p>
      </div>

      {/* Jobs Grid */}
      {allJobs?.length <= 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-400">
          No jobs available right now
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allJobs.slice(0, 6).map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <LatestJobCards job={job} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestJobs;
