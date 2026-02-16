import React, { useEffect, useState, useMemo } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search } from "lucide-react"; // added

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  const [filterJobs, setFilterJobs] = useState(allJobs);

  // local search state
  const [localSearch, setLocalSearch] = useState("");

  /* ================= existing redux filter (unchanged) ================= */
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

  /* ================= NEW: local title search only ================= */
  const finalJobs = useMemo(() => {
    if (!localSearch) return filterJobs;

    return filterJobs.filter((job) =>
      job.title.toLowerCase().includes(localSearch.toLowerCase())
    );
  }, [filterJobs, localSearch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-24 px-4">
        <div className="flex gap-8">

          {/* Sidebar Filter */}
          <div className="w-72 shrink-0">
            <div className="sticky top-24 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <FilterCard />
            </div>
          </div>

          {/* Jobs Section */}
          <div className="flex-1">

            {/* ================= Search with icon ================= */}
            <div className="relative mb-6 w-full md:w-80">
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
              <div className="flex items-center justify-center h-[60vh] text-gray-500 text-lg font-medium">
                No Jobs Found
              </div>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
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
