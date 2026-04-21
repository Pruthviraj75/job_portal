// import React, { useEffect, useState, useMemo } from "react";
// import FilterCard from "./FilterCard";
// import Job from "./Job";
// import Navbar from "./shared/Navbar";
// import { useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react"; // added

// const Jobs = () => {
//   const { allJobs, searchedQuery } = useSelector((store) => store.job);

//   const [filterJobs, setFilterJobs] = useState(allJobs);

//   // local search state
//   const [localSearch, setLocalSearch] = useState("");

//   /* ================= existing redux filter (unchanged) ================= */
//   useEffect(() => {
//     if (searchedQuery) {
//       const filteredJobs = allJobs.filter((job) => {
//         return (
//           job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
//           job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
//           job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
//           job.salary.toString().includes(searchedQuery)
//         );
//       });
//       setFilterJobs(filteredJobs);
//     } else {
//       setFilterJobs(allJobs);
//     }
//   }, [allJobs, searchedQuery]);

//   /* ================= NEW: local title search only ================= */
//   const finalJobs = useMemo(() => {
//     if (!localSearch) return filterJobs;

//     return filterJobs.filter((job) =>
//       job.title.toLowerCase().includes(localSearch.toLowerCase())
//     );
//   }, [filterJobs, localSearch]);

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />

//       <div className="max-w-7xl mx-auto pt-24 px-4">
//         <div className="flex gap-8">

//           {/* Sidebar Filter */}
//           <div className="w-72 shrink-0">
//             <div className="sticky top-24 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//               <FilterCard />
//             </div>
//           </div>

//           {/* Jobs Section */}
//           <div className="flex-1">

//             {/* ================= Search with icon ================= */}
//             <div className="relative mb-6 w-full md:w-80">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search job title..."
//                 value={localSearch}
//                 onChange={(e) => setLocalSearch(e.target.value)}
//                 className="w-full border rounded-xl pl-10 pr-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30"
//               />
//             </div>

//             {finalJobs.length <= 0 ? (
//               <div className="flex items-center justify-center h-[60vh] text-gray-500 text-lg font-medium">
//                 No Jobs Found
//               </div>
//             ) : (
//               <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
//                 {finalJobs.map((job) => (
//                   <motion.div
//                     key={job._id}
//                     className="transition-all duration-300 hover:-translate-y-1 rounded-2xl"
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Job job={job} />
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Jobs;



import React, { useEffect, useState, useMemo } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [localSearch, setLocalSearch] = useState("");

  // Mobile filter drawer state
  const [filterOpen, setFilterOpen] = useState(false);

  /* ── existing redux filter (unchanged) ──────────────────────────── */
  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.salary.toString().includes(searchedQuery)
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  /* ── local title search ─────────────────────────────────────────── */
  const finalJobs = useMemo(() => {
    if (!localSearch) return filterJobs;
    return filterJobs.filter((job) =>
      job.title.toLowerCase().includes(localSearch.toLowerCase())
    );
  }, [filterJobs, localSearch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-20 sm:pt-24 px-4">

        {/* ── Mobile: search + filter toggle bar ─────────────────────── */}
        <div className="flex items-center gap-3 mb-4 lg:hidden">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search job title..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30"
            />
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white text-sm font-medium text-gray-700
              hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors shrink-0"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* ── Mobile filter drawer overlay ────────────────────────────── */}
        <AnimatePresence>
          {filterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFilterOpen(false)}
              />

              {/* Drawer — slides in from left */}
              <motion.div
                key="drawer"
                className="fixed top-0 left-0 h-full w-72 sm:w-80 z-50 lg:hidden bg-white shadow-2xl rounded-r-2xl overflow-hidden flex flex-col"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.28 }}
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                  <h2 className="text-base font-semibold text-gray-800">Filters</h2>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* FilterCard inside drawer */}
                <div className="flex-1 overflow-y-auto">
                  <FilterCard onSelect={() => setFilterOpen(false)} />
                </div>

                {/* Done button */}
                <div className="px-5 py-4 border-t border-gray-100 shrink-0">
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-[#6A38C2] text-white text-sm font-medium
                      hover:bg-[#5b30a6] transition-colors"
                  >
                    Show Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Main layout ─────────────────────────────────────────────── */}
        <div className="flex gap-6 xl:gap-8">

          {/* Sidebar — hidden on mobile/tablet, shown on lg+ */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100">
              <FilterCard />
            </div>
          </aside>

          {/* Jobs section */}
          <div className="flex-1 min-w-0">

            {/* Desktop search bar — hidden on mobile (shown in top bar instead) */}
            <div className="hidden lg:block relative mb-6 w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search job title..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full border rounded-xl pl-10 pr-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/30"
              />
            </div>

            {finalJobs.length <= 0 ? (
              <div className="flex items-center justify-center h-[60vh] text-gray-500 text-base sm:text-lg font-medium">
                No Jobs Found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pb-10">
                {finalJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    className="transition-all duration-300 hover:-translate-y-1 rounded-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;