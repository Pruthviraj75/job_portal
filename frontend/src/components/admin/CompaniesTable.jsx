import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Edit2, MoreHorizontal, Building2, Trash2, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_API_ENDPOINT } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";
import CompanyDetails from "./CompanyDetails";

const ITEMS_PER_PAGE = 5;

const CompaniesTable = ({ companies = [] }) => {
  const navigate = useNavigate();
  const { searchCompanyByText } = useSelector((store) => store.company);

  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);

  /* ---------------- FILTER ---------------- */
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });
  }, [companies, searchCompanyByText]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [searchCompanyByText]);

  /* ---------------- OUTSIDE CLICK CLOSE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- DELETE ---------------- */
  const deleteCompanyHandler = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await axios.delete(`${COMPANY_API_ENDPOINT}/delete/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Company deleted successfully");
      }
    } catch {
      toast.error("Failed to delete company");
    }
  };

  /* ---------------- EMPTY ---------------- */
  if (!filteredCompanies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="w-14 h-14 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">No companies found</p>
        <Button
          onClick={() => navigate("/admin/companies/create")}
          className="bg-[#7209b7] hover:bg-[#5f32ad] rounded-xl"
        >
          + Add Company
        </Button>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div ref={containerRef} className="space-y-5">
      {paginatedCompanies.map((company, index) => (
        <motion.div
         onClick={()=>navigate(`/admin/companies/${company._id}/details`)}
          key={company._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          onMouseEnter={() => setActiveId(company._id)}
          onMouseLeave={() => setActiveId(null)}
          className="relative bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex items-center justify-between gap-4 group"
        >
          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-14 w-14 rounded-xl">
              <AvatarImage src={company.logo} />
            </Avatar>

            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">
                {company.name}
              </h3>

              <p className="text-sm text-gray-500 truncate max-w-[420px]">
                {company.description || "No description added"}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Calendar size={12} />
                {company?.createdAt?.split("T")[0]}
              </div>
            </div>
          </div>

          {/* RIGHT ACTION BAR (hover reveal) */}
          <AnimatePresence>
            {activeId === company._id && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 bg-gray-50 border rounded-xl px-2 py-1 shadow-sm"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  title="Edit"
                  onClick={(e) =>{
                    e.stopPropagation();
                    navigate(`/admin/companies/${company._id}`)}}
                  className="hover:bg-gray-200 rounded-lg text-[#6A38C2]"
                >
                  <Edit2 size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  title="Delete"
                  onClick={(e) =>{ 
                    e.stopPropagation();
                    deleteCompanyHandler(company._id)}}
                  className="hover:bg-red-100 text-[#6A38C2] rounded-lg"
                >
                  <Trash2 size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* ---------------- PAGINATION ---------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl"
          >
            Prev
          </Button>

          <span className="px-3 py-2 text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;



// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Avatar, AvatarImage } from "../ui/avatar";
// import { Edit2, Building2, Trash2, Calendar } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router";
// import { Button } from "../ui/button";
// import axios from "axios";
// import { toast } from "sonner";
// import { COMPANY_API_ENDPOINT } from "../utils/constant";
// import { motion, AnimatePresence } from "framer-motion";

// const ITEMS_PER_PAGE = 5;

// const CompaniesTable = ({ companies = [] }) => {
//   const navigate = useNavigate();
//   const { searchCompanyByText } = useSelector((store) => store.company);

//   const [page, setPage] = useState(1);
//   const [activeId, setActiveId] = useState(null);
//   const containerRef = useRef(null);

//   /* ---------------- FILTER ---------------- */
//   const filteredCompanies = useMemo(() => {
//     return companies.filter((company) => {
//       if (!searchCompanyByText) return true;
//       return company?.name
//         ?.toLowerCase()
//         .includes(searchCompanyByText.toLowerCase());
//     });
//   }, [companies, searchCompanyByText]);

//   /* ---------------- PAGINATION ---------------- */
//   const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

//   const paginatedCompanies = filteredCompanies.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   useEffect(() => {
//     setPage(1);
//   }, [searchCompanyByText]);

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

//   /* ---------------- DELETE ---------------- */
//   const deleteCompanyHandler = async (id) => {
//     if (!confirm("Are you sure you want to delete this company?")) return;
//     try {
//       const res = await axios.delete(`${COMPANY_API_ENDPOINT}/delete/${id}`, {
//         withCredentials: true,
//       });
//       if (res.data.success) toast.success("Company deleted successfully");
//     } catch {
//       toast.error("Failed to delete company");
//     }
//   };

//   /* ---------------- EMPTY ---------------- */
//   if (!filteredCompanies.length) {
//     return (
//       <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center px-4">
//         <Building2 className="w-10 h-10 sm:w-14 sm:h-14 text-gray-300 mb-3 sm:mb-4" />
//         <p className="text-gray-500 text-sm sm:text-base mb-4">No companies found</p>
//         <Button
//           onClick={() => navigate("/admin/companies/create")}
//           className="bg-[#7209b7] hover:bg-[#5f32ad] rounded-xl text-sm"
//         >
//           + Add Company
//         </Button>
//       </div>
//     );
//   }

//   /* ---------------- UI ---------------- */
//   return (
//     <div ref={containerRef} className="space-y-3 sm:space-y-4">
//       {paginatedCompanies.map((company, index) => (
//         <motion.div
//           key={company._id}
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.04 }}
//           onClick={() => navigate(`/admin/companies/${company._id}/details`)}
//           onMouseEnter={() => setActiveId(company._id)}
//           onMouseLeave={() => setActiveId(null)}
//           className="
//             relative bg-white border rounded-2xl shadow-sm
//             hover:shadow-md transition-all
//             p-3 sm:p-4 lg:p-5
//             flex items-center justify-between gap-3 sm:gap-4
//             cursor-pointer group
//           "
//         >
//           {/* LEFT */}
//           <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">

//             {/* Avatar — smaller on mobile */}
//             <Avatar className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl shrink-0">
//               <AvatarImage src={company.logo} />
//             </Avatar>

//             <div className="min-w-0 flex-1">
//               <h3 className="font-semibold text-sm sm:text-base truncate">
//                 {company.name}
//               </h3>

//               {/* Description — hidden on mobile, visible sm+ */}
//               <p className="hidden sm:block text-xs sm:text-sm text-gray-500 truncate max-w-[280px] md:max-w-[380px] lg:max-w-[420px]">
//                 {company.description || "No description added"}
//               </p>

//               <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 sm:mt-1">
//                 <Calendar size={11} className="shrink-0" />
//                 <span>{company?.createdAt?.split("T")[0]}</span>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT — hover reveal on desktop, always visible on mobile (touch has no hover) */}
//           <div
//             className="
//               flex items-center gap-1 sm:gap-2
//               sm:bg-gray-50 sm:border sm:rounded-xl sm:px-2 sm:py-1 sm:shadow-sm
//               /* always visible on mobile */
//               opacity-100
//               sm:opacity-0 sm:group-hover:opacity-100
//               sm:transition-opacity sm:duration-200
//             "
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Button
//               size="icon"
//               variant="ghost"
//               title="Edit"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 navigate(`/admin/companies/${company._id}`);
//               }}
//               className="
//                 h-8 w-8 sm:h-9 sm:w-9
//                 hover:bg-gray-200 rounded-lg text-[#6A38C2]
//               "
//             >
//               <Edit2 size={14} className="sm:w-4 sm:h-4" />
//             </Button>

//             <Button
//               size="icon"
//               variant="ghost"
//               title="Delete"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 deleteCompanyHandler(company._id);
//               }}
//               className="
//                 h-8 w-8 sm:h-9 sm:w-9
//                 hover:bg-red-100 text-[#6A38C2] rounded-lg
//               "
//             >
//               <Trash2 size={14} className="sm:w-4 sm:h-4" />
//             </Button>
//           </div>

//         </motion.div>
//       ))}

//       {/* ---------------- PAGINATION ---------------- */}
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

//           <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500">
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

// export default CompaniesTable;