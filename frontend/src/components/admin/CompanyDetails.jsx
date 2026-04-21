// import React, { useState, useEffect } from "react";
// import useGetCompanyById from "../../hooks/useGetCompanyById";
// import { useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router";
// import { ArrowLeft, Trash2, Briefcase, Users } from "lucide-react";
// import axios from "axios";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// import { motion, AnimatePresence } from "framer-motion";
// import { COMPANY_API_ENDPOINT, Job_API_ENDPOINT } from "../utils/constant";

// const ITEMS_PER_PAGE = 5;

// const CompanyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [companyJobs, setCompanyJobs] = useState([]);
//   const [page, setPage] = useState(1);
//   const [activeJobId, setActiveJobId] = useState(null);
//   const [sortOrder, setSortOrder] = useState("new");

//   useGetCompanyById(id);
//   const { singleCompany } = useSelector((store) => store.company);

//   if (!singleCompany) {
//     return (
//       <div className="p-10 text-center text-gray-500 text-lg">
//         Loading company details...
//       </div>
//     );
//   }

//   // Fetch jobs for this company
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const res = await axios.get(`${Job_API_ENDPOINT}/company/${id}`, { withCredentials: true });
//         if (res.data.success) {
//           setCompanyJobs(res.data.jobs);
//         }
//       } catch (error) {
//         console.log(error);
//         toast.error("Failed to fetch jobs");
//       }
//     };
//     fetchJobs();
//   }, [id]);

//   // Sort + Pagination
//   const sortedJobs = companyJobs
//     .sort((a, b) =>
//       sortOrder === "new"
//         ? new Date(b.createdAt) - new Date(a.createdAt)
//         : new Date(a.createdAt) - new Date(b.createdAt)
//     );

//   const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
//   const paginatedJobs = sortedJobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//   const handleDelete = async () => {
//     try {
//       const res = await axios.delete(`${COMPANY_API_ENDPOINT}/${id}`, { withCredentials: true });
//       if (res.data.success) {
//         toast.success("Company deleted successfully");
//         navigate("/admin/companies");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-black transition"
//       >
//         <ArrowLeft size={18} /> Back
//       </button>

//       {/* Company Card */}
//       <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto hover:shadow-xl transition">

//         {/* Header */}
//         <div className="flex justify-between items-start mb-8">
//           <div className="flex items-center gap-6">
//             <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center hover:scale-105 transition duration-300">
//               <img
//                 src={singleCompany.logo}
//                 alt={singleCompany.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">{singleCompany.name}</h1>
//               <p className="text-gray-500 mt-1">{singleCompany.location}</p>
//             </div>
//           </div>

//           {/* Delete Button */}
//           <button
//             onClick={() => setShowConfirm(true)}
//             className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
//           >
//             <Trash2 size={16} />
//             Delete
//           </button>
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//           <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
//             <Briefcase className="text-blue-600" size={28} />
//             <div>
//               <p className="text-gray-400 text-sm">Total Jobs</p>
//               <h3 className="text-2xl font-bold text-gray-800">{singleCompany.jobsCount || 0}</h3>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
//             <Users className="text-green-600" size={28} />
//             <div>
//               <p className="text-gray-400 text-sm">Total Applicants</p>
//               <h3 className="text-2xl font-bold text-gray-800">{singleCompany.applicantsCount || 0}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="space-y-6 mb-10">
//           <div>
//             <h3 className="text-sm text-gray-400 uppercase tracking-wide">Description</h3>
//             <p className="text-gray-700 mt-2 leading-relaxed">{singleCompany.description}</p>
//           </div>

//           <div>
//             <h3 className="text-sm text-gray-400 uppercase tracking-wide">Website</h3>
//             <a
//               href={singleCompany.website}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:underline mt-2 block"
//             >
//               {singleCompany.website}
//             </a>
//           </div>
//         </div>

//         {/* Jobs Preview Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Jobs Posted</h2>
//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="border rounded-xl px-3 py-1 text-sm"
//           >
//             <option value="new">Newest First</option>
//             <option value="old">Oldest First</option>
//           </select>
//         </div>

//         {/* Jobs Cards */}
//         <div className="space-y-4">
//           {paginatedJobs.length === 0 && (
//             <div className="text-gray-500 text-center py-4">No jobs found.</div>
//           )}

//           {paginatedJobs.map((job) => (
//             <motion.div
//               key={job._id}
//               onMouseEnter={() => setActiveJobId(job._id)}
//               onMouseLeave={() => setActiveJobId(null)}
//               className="relative bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between gap-4"
//             >
//               {/* LEFT */}
//               <div className="flex items-center gap-4 min-w-0">
//                 <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gray-100">
//                   <Briefcase size={22} />
//                 </div>

//                 <div className="min-w-0">
//                   <h3 className="font-semibold text-base truncate">{job.title}</h3>
//                   <p className="text-sm text-gray-500 truncate">{singleCompany.name}</p>
//                   <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
//                     <span>Posted: {job.createdAt.split("T")[0]}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT ACTIONS */}
//               <AnimatePresence>
//                 {activeJobId === job._id && (
//                   <motion.div
//                     initial={{ opacity: 0, x: 10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 10 }}
//                     className="flex items-center gap-2 bg-gray-50 border rounded-xl px-2 py-1 shadow-sm"
//                   >
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => navigate(`/admin/jobs/${job._id}`)}
//                       className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
//                       title="Edit Job"
//                     >
//                       Edit
//                     </Button>

//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
//                       className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
//                       title="View Applicants"
//                     >
//                       Applicants
//                     </Button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center gap-2 pt-6">
//             <Button
//               variant="outline"
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="rounded-xl"
//             >
//               Prev
//             </Button>

//             <span className="px-3 py-2 text-sm text-gray-500">
//               Page {page} of {totalPages}
//             </span>

//             <Button
//               variant="outline"
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => p + 1)}
//               className="rounded-xl"
//             >
//               Next
//             </Button>
//           </div>
//         )}

//       </div>

//       {/* Confirmation Modal */}
//       {showConfirm && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
//             <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this company? This action cannot be undone.
//             </p>

//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyDetails;




import React, { useState, useEffect } from "react";
import useGetCompanyById from "../../hooks/useGetCompanyById";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Trash2, Briefcase, Users, Edit2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANY_API_ENDPOINT, Job_API_ENDPOINT } from "../utils/constant";

const ITEMS_PER_PAGE = 5;

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [activeJobId, setActiveJobId] = useState(null);
  const [sortOrder, setSortOrder] = useState("new");

  useGetCompanyById(id);
  const { singleCompany } = useSelector((store) => store.company);

  if (!singleCompany) {
    return (
      <div className="p-10 text-center text-gray-500 text-base sm:text-lg">
        Loading company details...
      </div>
    );
  }

  /* ---------------- FETCH JOBS ---------------- */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${Job_API_ENDPOINT}/company/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) setCompanyJobs(res.data.jobs);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, [id]);

  /* ---------------- SORT + PAGINATE ---------------- */
  const sortedJobs = [...companyJobs].sort((a, b) =>
    sortOrder === "new"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = sortedJobs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ---------------- DELETE COMPANY ---------------- */
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${COMPANY_API_ENDPOINT}/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Company deleted successfully");
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-5 lg:px-8 py-5 sm:py-6 lg:py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-5 sm:mb-6 text-sm font-medium text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        Back
      </button>

      {/* Company Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto hover:shadow-xl transition">

        {/* ===== HEADER ===== */}
        {/* Stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">

          {/* Logo + Name */}
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-6 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center shrink-0 hover:scale-105 transition duration-300">
              <img
                src={singleCompany.logo}
                alt={singleCompany.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
                {singleCompany.name}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 sm:mt-1">
                {singleCompany.location}
              </p>
            </div>
          </div>

          {/* Delete Button — full width on mobile, auto on sm+ */}
          <button
            onClick={() => setShowConfirm(true)}
            className="
              flex items-center justify-center gap-2
              w-full sm:w-auto shrink-0
              bg-red-50 text-red-600
              px-4 py-2 rounded-lg text-sm
              hover:bg-red-100 transition
            "
          >
            <Trash2 size={15} />
            Delete
          </button>

        </div>

        {/* ===== STATS ===== */}
        {/* 1 col mobile, 2 col md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-7 sm:mb-10">

          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 lg:p-6 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition">
            <Briefcase className="text-blue-600 shrink-0" size={22} />
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total Jobs</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {singleCompany.jobsCount || 0}
              </h3>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 lg:p-6 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition">
            <Users className="text-green-600 shrink-0" size={22} />
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total Applicants</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {singleCompany.applicantsCount || 0}
              </h3>
            </div>
          </div>

        </div>

        {/* ===== DESCRIPTION + WEBSITE ===== */}
        <div className="space-y-4 sm:space-y-6 mb-7 sm:mb-10">
          <div>
            <h3 className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-gray-700 mt-1.5 sm:mt-2 leading-relaxed text-sm sm:text-base">
              {singleCompany.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
              Website
            </h3>
            <a
              href={singleCompany.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-1.5 sm:mt-2 block text-sm sm:text-base break-all"
            >
              {singleCompany.website}
            </a>
          </div>
        </div>

        {/* ===== JOBS HEADER ===== */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Jobs Posted</h2>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-xl px-3 py-1.5 text-xs sm:text-sm w-full xs:w-auto"
          >
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>
        </div>

        {/* ===== JOB CARDS ===== */}
        <div className="space-y-3 sm:space-y-4">
          {paginatedJobs.length === 0 && (
            <div className="text-gray-500 text-center py-4 text-sm sm:text-base">
              No jobs found.
            </div>
          )}

          {paginatedJobs.map((job) => (
            <motion.div
              key={job._id}
              onMouseEnter={() => setActiveJobId(job._id)}
              onMouseLeave={() => setActiveJobId(null)}
              className="
                relative bg-white border rounded-2xl shadow-sm
                hover:shadow-md transition-all
                p-3 sm:p-4 lg:p-5
                flex items-center justify-between gap-3 sm:gap-4
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 flex items-center justify-center rounded-xl bg-gray-100 shrink-0">
                  <Briefcase size={18} className="sm:w-5 sm:h-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">
                    {job.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {singleCompany.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">
                    Posted: {job.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>

              {/* RIGHT ACTIONS
                  — always visible on mobile (no hover on touch),
                  — hover-reveal on sm+ */}
              <div
                className="
                  flex items-center gap-1 sm:gap-2
                  /* mobile: always show as compact icon buttons */
                  opacity-100
                  sm:opacity-0 sm:group-hover:opacity-100
                  sm:bg-gray-50 sm:border sm:rounded-xl sm:px-2 sm:py-1 sm:shadow-sm
                  sm:transition-opacity sm:duration-200
                "
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate(`/admin/jobs/${job._id}`)}
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                  title="Edit Job"
                >
                  <Edit2 size={14} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                  title="View Applicants"
                >
                  <Users size={14} />
                </Button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-3 pt-5 sm:pt-6">
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

      {/* ===== CONFIRM DELETE MODAL ===== */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          {/* w-full on mobile, max-w-sm on sm+ */}
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-5 sm:mb-6">
              Are you sure you want to delete this company? This action cannot
              be undone.
            </p>

            {/* Buttons — stacked on mobile, row on sm+ */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyDetails;