// import React, { useState, useEffect } from "react";
// import Navbar from "../shared/Navbar";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { useNavigate } from "react-router";
// import { useDispatch } from "react-redux";

// import AdminJobsTable from "./AdminJobsTable";
// import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
// import { clearSingleJob, setSearchJobByText } from "../../redux/jobSlice";

// const AdminJobs = () => {
//   useGetAllAdminJobs();

//   const [input, setInput] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(setSearchJobByText(input));
//   }, [input, dispatch]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       {/* main content */}
//       <div className="max-w-6xl mx-auto px-4 pt-0 pb-10">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Manage Jobs</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Create, search and manage all posted jobs
//           </p>
//         </div>

//         {/* Controls Card */}
//         <div className="bg-white rounded-2xl shadow-sm border p-5 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Search by job title, company or role..."
//               className="w-full sm:w-80"
//             />

//             <Button
//               onClick={() =>{ 
//                 dispatch(clearSingleJob());
//                 navigate("/admin/jobs/create")}}
//               className="px-6"
//             >
//               + New Job
//             </Button>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-2xl shadow-sm border p-5">
//           <AdminJobsTable />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminJobs;




import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Search, Plus } from "lucide-react";

import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import { clearSingleJob, setSearchJobByText } from "../../redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-10 space-y-5 sm:space-y-6">

        {/* ===== HEADER ===== */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manage Jobs
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Create, search and manage all posted jobs
          </p>
        </div>

        {/* ===== CONTROLS CARD ===== */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

            {/* Search — full width on mobile, fixed on sm+ */}
            <div className="relative w-full sm:w-80">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search by job title or company..."
                className="pl-9 w-full text-sm"
              />
            </div>

            {/* New Job — full width on mobile, auto on sm+ */}
            <Button
              onClick={() => {
                dispatch(clearSingleJob());
                navigate("/admin/jobs/create");
              }}
              className="
                w-full sm:w-auto
                bg-[#7209b7] hover:bg-[#5f32ad]
                rounded-xl flex items-center justify-center gap-2
                text-sm px-5
              "
            >
              <Plus size={16} />
              New Job
            </Button>

          </div>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5">
          <AdminJobsTable />
        </div>

      </div>
    </div>
  );
};

export default AdminJobs;