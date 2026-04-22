// import React from "react";
// import LatestJobCards from "./LatestJobCards";
// import { useSelector } from "react-redux";
// import { motion } from "framer-motion";

// const LatestJobs = () => {
//   const { allJobs } = useSelector((store) => store.job);

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-20 bg-white">
//       {/* Section Header */}
//       <div className="mb-10">
//         <h1 className="text-3xl sm:text-4xl font-bold">
//           <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
//         </h1>
//         <p className="text-gray-500 mt-2 text-sm sm:text-base">
//           Discover the most recent opportunities from top companies
//         </p>
//       </div>

//       {/* Jobs Grid */}
//       {allJobs?.length <= 0 ? (
//         <div className="flex justify-center items-center h-40 text-gray-400">
//           No jobs available right now
//         </div>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {allJobs.slice(0, 6).map((job, index) => (
//             <motion.div
//               key={job._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.25, delay: index * 0.05 }}
//               className="
//                 transition-all duration-300
//                 hover:-translate-y-1
//               "
//             >
//               <LatestJobCards job={job} />
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default LatestJobs;


import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white">

      {/* ===== BACK BUTTON ===== */}
      <button
        onClick={() => navigate("/")}
        className="
          flex items-center gap-2 mb-6 sm:mb-8
          text-sm font-medium text-gray-500
          hover:text-[#6A38C2] transition-colors duration-200
        "
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      {/* ===== SECTION HEADER ===== */}
      <div className="mb-7 sm:mb-9 lg:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
          <span className="text-[#6A38C2]">Latest & Top</span> Job Openings
        </h1>
        <p className="text-gray-500 mt-2 text-xs sm:text-sm lg:text-base">
          Discover the most recent opportunities from top companies
        </p>
      </div>

      {/* ===== JOBS GRID ===== */}
      {allJobs?.length <= 0 ? (
        <div className="flex justify-center items-center h-32 sm:h-40 text-gray-400 text-sm sm:text-base">
          No jobs available right now
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {allJobs.slice(0, 6).map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="transition-all duration-300 hover:-translate-y-1"
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