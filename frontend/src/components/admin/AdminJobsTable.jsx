// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Edit2, Eye, Calendar, Briefcase, Trash2 } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router";
// import { Button } from "../ui/button";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import axios from "axios";
// import { setSingleJob } from "../../redux/jobSlice";
// import { Job_API_ENDPOINT } from "../utils/constant";

// const ITEMS_PER_PAGE = 5;

// const AdminJobsTable = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const containerRef = useRef(null);

//   const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

//   const [jobs, setJobs] = useState(allAdminJobs); // ⚡ local state
//   const [page, setPage] = useState(1);
//   const [activeId, setActiveId] = useState(null);
//   const [sortOrder, setSortOrder] = useState("new");

//   // Sync local state when redux updates
//   useEffect(() => {
//     setJobs(allAdminJobs);
//   }, [allAdminJobs]);

//   /* ---------------- FILTER + SORT ---------------- */
//   const filteredJobs = useMemo(() => {
//     let filtered = jobs.filter((job) => {
//       if (!searchJobByText) return true;

//       return (
//         job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
//         job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
//       );
//     });

//     return filtered.sort((a, b) =>
//       sortOrder === "new"
//         ? new Date(b.createdAt) - new Date(a.createdAt)
//         : new Date(a.createdAt) - new Date(b.createdAt)
//     );
//   }, [jobs, searchJobByText, sortOrder]);

//   /* ---------------- PAGINATION ---------------- */
//   const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
//   const paginatedJobs = filteredJobs.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   useEffect(() => {
//     setPage(1);
//   }, [searchJobByText, sortOrder]);

//   /* ---------------- OUTSIDE CLICK CLOSE ---------------- */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setActiveId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ---------------- DELETE JOB ---------------- */
//   const handleDelete = async (id) => {
//     try {
//       // Optimistically remove job from UI
//       setJobs((prev) => prev.filter((job) => job._id !== id));
//       setActiveId(null);

//       const res = await axios.delete(`${Job_API_ENDPOINT}/${id}`, {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         toast.success("Job deleted successfully");
//       } else {
//         toast.error("Delete failed");
//         // rollback if failed
//         setJobs(allAdminJobs);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Delete failed");
//       setJobs(allAdminJobs); // rollback
//     }
//   };

//   if (!filteredJobs.length) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <Briefcase className="w-14 h-14 text-gray-300 mb-4" />
//         <p className="text-gray-500">No jobs found</p>
//       </div>
//     );
//   }

//   return (
//     <div ref={containerRef} className="space-y-5">
//       {/* SORT */}
//       <div className="flex justify-end">
//         <select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value)}
//           className="border rounded-xl px-3 py-1 text-sm"
//         >
//           <option value="new">Newest First</option>
//           <option value="old">Oldest First</option>
//         </select>
//       </div>

//       {/* CARDS */}
//       {paginatedJobs.map((job, index) => (
//         <motion.div
//           key={job._id}
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 8 }}
//           transition={{ delay: index * 0.04 }}
//           onMouseEnter={() => setActiveId(job._id)}
//           onMouseLeave={() => setActiveId(null)}
//           className="relative bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between gap-4"
//         >
//           {/* LEFT */}
//           <div className="flex items-center gap-4 min-w-0">
//             <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gray-100">
//               <Briefcase size={22} />
//             </div>

//             <div className="min-w-0">
//               <h3 className="font-semibold truncate">{job.title}</h3>
//               <p className="text-sm text-gray-500 truncate">{job.company?.name}</p>
//               <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
//                 <Calendar size={12} />
//                 {job?.createdAt?.split("T")[0]}
//               </div>
//             </div>
//           </div>

//           {/* ACTION BAR */}
//           <AnimatePresence>
//             {activeId === job._id && (
//               <motion.div
//                 initial={{ opacity: 0, x: 10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 10 }}
//                 className="flex items-center gap-2 bg-gray-50 border rounded-xl px-2 py-1 shadow-sm"
//               >
//                 {/* Edit */}
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => {
//                     dispatch(setSingleJob(job));
//                     navigate(`/admin/jobs/edit/${job._id}`);
//                   }}
//                   className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
//                 >
//                   <Edit2 size={16} />
//                 </Button>

//                 {/* Applicants */}
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
//                   className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
//                 >
//                   <Eye size={16} />
//                 </Button>

//                 {/* Delete */}
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => handleDelete(job._id)}
//                   className="hover:bg-red-100 text-red-500 rounded-lg"
//                 >
//                   <Trash2 size={16} />
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       ))}

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex justify-center gap-2 pt-6">
//           <Button
//             variant="outline"
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded-xl"
//           >
//             Prev
//           </Button>

//           <span className="px-3 py-2 text-sm text-gray-500">
//             Page {page} of {totalPages}
//           </span>

//           <Button
//             variant="outline"
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="rounded-xl"
//           >
//             Next
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminJobsTable;








// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Edit2, Eye, Calendar, Briefcase, Trash2 } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router";
// import { Button } from "../ui/button";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import axios from "axios";
// import { setSingleJob } from "../../redux/jobSlice";
// import { Job_API_ENDPOINT } from "../utils/constant";

// const ITEMS_PER_PAGE = 5;

// const AdminJobsTable = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const containerRef = useRef(null);

//   const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

//   const [jobs, setJobs] = useState(allAdminJobs);
//   const [page, setPage] = useState(1);
//   const [activeId, setActiveId] = useState(null);
//   const [sortOrder, setSortOrder] = useState("new");

//   /* Sync local state when redux updates */
//   useEffect(() => {
//     setJobs(allAdminJobs);
//   }, [allAdminJobs]);

//   /* ---------------- FILTER + SORT ---------------- */
//   const filteredJobs = useMemo(() => {
//     let filtered = jobs.filter((job) => {
//       if (!searchJobByText) return true;
//       return (
//         job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
//         job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
//       );
//     });

//     return filtered.sort((a, b) =>
//       sortOrder === "new"
//         ? new Date(b.createdAt) - new Date(a.createdAt)
//         : new Date(a.createdAt) - new Date(b.createdAt)
//     );
//   }, [jobs, searchJobByText, sortOrder]);

//   /* ---------------- PAGINATION ---------------- */
//   const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
//   const paginatedJobs = filteredJobs.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   useEffect(() => {
//     setPage(1);
//   }, [searchJobByText, sortOrder]);

//   /* ---------------- OUTSIDE CLICK ---------------- */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target))
//         setActiveId(null);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ---------------- DELETE ---------------- */
//   const handleDelete = async (id) => {
//     try {
//       setJobs((prev) => prev.filter((job) => job._id !== id));
//       setActiveId(null);

//       const res = await axios.delete(`${Job_API_ENDPOINT}/${id}`, {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         toast.success("Job deleted successfully");
//       } else {
//         toast.error("Delete failed");
//         setJobs(allAdminJobs);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Delete failed");
//       setJobs(allAdminJobs);
//     }
//   };

//   /* ---------------- EMPTY STATE ---------------- */
//   if (!filteredJobs.length) {
//     return (
//       <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
//         <Briefcase className="w-10 h-10 sm:w-14 sm:h-14 text-gray-300 mb-3 sm:mb-4" />
//         <p className="text-gray-500 text-sm sm:text-base">No jobs found</p>
//       </div>
//     );
//   }

//   return (
//     <div ref={containerRef} className="space-y-3 sm:space-y-4">

//       {/* ===== SORT ===== */}
//       <div className="flex justify-end">
//         <select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value)}
//           className="border rounded-xl px-3 py-1.5 text-xs sm:text-sm"
//         >
//           <option value="new">Newest First</option>
//           <option value="old">Oldest First</option>
//         </select>
//       </div>

//       {/* ===== JOB CARDS ===== */}
//       {paginatedJobs.map((job, index) => (
//         <motion.div
//           key={job._id}
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 8 }}
//           transition={{ delay: index * 0.04 }}
//           onMouseEnter={() => setActiveId(job._id)}
//           onMouseLeave={() => setActiveId(null)}
//           className="
//             relative bg-white border rounded-2xl shadow-sm
//             hover:shadow-md transition-all
//             p-3 sm:p-4 lg:p-5
//             flex items-center justify-between gap-3 sm:gap-4
//             group
//           "
//         >
//           {/* LEFT */}
//           <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">

//             {/* Icon — smaller on mobile */}
//             <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 flex items-center justify-center rounded-xl bg-gray-100 shrink-0">
//               <Briefcase size={18} className="sm:w-5 sm:h-5 lg:w-[22px] lg:h-[22px]" />
//             </div>

//             <div className="min-w-0">
//               <h3 className="font-semibold text-sm sm:text-base truncate">
//                 {job.title}
//               </h3>
//               <p className="text-xs sm:text-sm text-gray-500 truncate">
//                 {job.company?.name}
//               </p>
//               <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 sm:mt-1">
//                 <Calendar size={11} className="shrink-0" />
//                 {job?.createdAt?.split("T")[0]}
//               </div>
//             </div>
//           </div>

//           {/* ACTION BAR — hover reveal only */}
//           <div
//             className="
//               flex items-center gap-1 sm:gap-2
//               opacity-0 group-hover:opacity-100
//               bg-gray-50 border rounded-xl px-2 py-1 shadow-sm
//               transition-opacity duration-200
//             "
//           >
//             {/* Edit */}
//             <Button
//               size="icon"
//               variant="ghost"
//               title="Edit Job"
//               onClick={() => {
//                 dispatch(setSingleJob(job));
//                 navigate(`/admin/jobs/edit/${job._id}`);
//               }}
//               className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-200 rounded-lg text-[#6A38C2]"
//             >
//               <Edit2 size={14} className="sm:w-4 sm:h-4" />
//             </Button>

//             {/* Applicants */}
//             <Button
//               size="icon"
//               variant="ghost"
//               title="View Applicants"
//               onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
//               className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-200 rounded-lg text-[#6A38C2]"
//             >
//               <Eye size={14} className="sm:w-4 sm:h-4" />
//             </Button>

//             {/* Delete */}
//             <Button
//               size="icon"
//               variant="ghost"
//               title="Delete Job"
//               onClick={() => handleDelete(job._id)}
//               className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-100 text-red-500 rounded-lg"
//             >
//               <Trash2 size={14} className="sm:w-4 sm:h-4" />
//             </Button>
//           </div>

//         </motion.div>
//       ))}

//       {/* ===== PAGINATION ===== */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 sm:gap-3 pt-4 sm:pt-6">
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="rounded-xl text-xs sm:text-sm px-3 sm:px-4"
//           >
//             Prev
//           </Button>

//           <span className="px-2 py-1 text-xs sm:text-sm text-gray-500">
//             Page {page} of {totalPages}
//           </span>

//           <Button
//             variant="outline"
//             size="sm"
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="rounded-xl text-xs sm:text-sm px-3 sm:px-4"
//           >
//             Next
//           </Button>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminJobsTable;




import React, { useEffect, useMemo, useRef, useState } from "react";
import { Edit2, Eye, Calendar, Briefcase, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { setSingleJob } from "../../redux/jobSlice";
import { Job_API_ENDPOINT } from "../utils/constant";

const ITEMS_PER_PAGE = 5;

const AdminJobsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  const [jobs, setJobs] = useState(allAdminJobs);
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [sortOrder, setSortOrder] = useState("new");

  /* Sync local state when redux updates */
  useEffect(() => {
    setJobs(allAdminJobs);
  }, [allAdminJobs]);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });

    return filtered.sort((a, b) =>
      sortOrder === "new"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [jobs, searchJobByText, sortOrder]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [searchJobByText, sortOrder]);

  /* ---------------- OUTSIDE CLICK CLOSE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setActiveId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- DELETE JOB ---------------- */
  const handleDelete = async (id) => {
    try {
      setJobs((prev) => prev.filter((job) => job._id !== id));
      setActiveId(null);

      const res = await axios.delete(`${Job_API_ENDPOINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job deleted successfully");
      } else {
        toast.error("Delete failed");
        setJobs(allAdminJobs);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      setJobs(allAdminJobs);
    }
  };

  /* ---------------- EMPTY STATE ---------------- */
  if (!filteredJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
        <Briefcase className="w-10 h-10 sm:w-14 sm:h-14 text-gray-300 mb-3 sm:mb-4" />
        <p className="text-gray-500 text-sm sm:text-base">No jobs found</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-3 sm:space-y-4 lg:space-y-5">

      {/* ===== SORT ===== */}
      <div className="flex justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-xl px-3 py-1.5 text-xs sm:text-sm"
        >
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
        </select>
      </div>

      {/* ===== JOB CARDS ===== */}
      {paginatedJobs.map((job, index) => (
        <motion.div
          key={job._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ delay: index * 0.04 }}
          onMouseEnter={() => setActiveId(job._id)}
          onMouseLeave={() => setActiveId(null)}
          className="
            relative bg-white border rounded-2xl shadow-sm
            hover:shadow-md transition-all
            p-3 sm:p-4 lg:p-5
            flex items-center justify-between gap-3 sm:gap-4
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">

            {/* Icon box — scales across breakpoints */}
            <div className="
              h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14
              flex items-center justify-center
              rounded-xl bg-gray-100 shrink-0
            ">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[22px] lg:h-[22px]" />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">
                {job.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {job.company?.name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 sm:mt-1">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                {job?.createdAt?.split("T")[0]}
              </div>
            </div>
          </div>

          {/* ACTION BAR — animated hover reveal on all screen sizes */}
          <AnimatePresence>
            {activeId === job._id && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="
                  flex items-center gap-1 sm:gap-2
                  bg-gray-50 border rounded-xl
                  px-1.5 sm:px-2 py-1
                  shadow-sm shrink-0
                "
              >
                {/* Edit */}
                <Button
                  size="icon"
                  variant="ghost"
                  title="Edit Job"
                  onClick={() => {
                    dispatch(setSingleJob(job));
                    navigate(`/admin/jobs/edit/${job._id}`);
                  }}
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                >
                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>

                {/* View Applicants */}
                <Button
                  size="icon"
                  variant="ghost"
                  title="View Applicants"
                  onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                >
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>

                {/* Delete */}
                <Button
                  size="icon"
                  variant="ghost"
                  title="Delete Job"
                  onClick={() => handleDelete(job._id)}
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-100 text-red-500 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      ))}

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-3 pt-4 sm:pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl text-xs sm:text-sm px-3 sm:px-4"
          >
            Prev
          </Button>

          <span className="px-2 py-1 text-xs sm:text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl text-xs sm:text-sm px-3 sm:px-4"
          >
            Next
          </Button>
        </div>
      )}

    </div>
  );
};

export default AdminJobsTable;