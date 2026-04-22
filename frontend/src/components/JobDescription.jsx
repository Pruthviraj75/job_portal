// import React, { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useParams } from "react-router";
// import axios from "axios";
// import { APPLICATION_API_ENDPOINT, Job_API_ENDPOINT } from "./utils/constant";
// import { useDispatch, useSelector } from "react-redux";
// import { setSingleJob } from "../redux/jobSlice";
// import { toast } from "sonner";

// const JobDescription = () => {
//   const { singleJob } = useSelector((store) => store.job);
//   const { user } = useSelector((store) => store.auth);

//   const [isApplied, setIsApplied] = useState(false);

//   const params = useParams();
//   const jobId = params.id;
//   const dispatch = useDispatch();

//   /* ---------------- APPLY JOB ---------------- */
//   const applyJobHandler = async () => {
//     if (isApplied) return;
//     if (!user) {
//     toast.error("Please login first");
//     return;
//     }
//     try {
//       const res = await axios.get(
//         `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         setIsApplied(true);

//         const updatedSingleJob = {
//           ...singleJob,
//           applications: [
//             ...singleJob.applications,
//             { applicant: user?._id },
//           ],
//         };

//         dispatch(setSingleJob(updatedSingleJob));
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     }
//   };

//   /* ---------------- FETCH JOB ---------------- */
//   useEffect(() => {
//     const fetchSingleJob = async () => {
//       try {
//         const res = await axios.get(
//           `${Job_API_ENDPOINT}/get/${jobId}`,
//           { withCredentials: true }
//         );

//         if (res.data.success) {
//           dispatch(setSingleJob(res.data.job));

//           const applied = res.data.job.applications.some(
//             (application) => application.applicant.toString() === user?._id
//           );

//           setIsApplied(applied);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchSingleJob();
//   }, [jobId, dispatch, user?._id]);

//   const formattedDate = singleJob?.createdAt
//     ? singleJob.createdAt.split("T")[0]
//     : "-";

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="max-w-5xl mx-auto my-12 px-4">
//       {/* Card */}
//       <div className="bg-white rounded-2xl shadow-md border p-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           <div>
//             <h1 className="text-2xl font-bold mb-3">
//               {singleJob?.title}
//             </h1>

//             <div className="flex flex-wrap gap-2">
//               <Badge className="text-blue-700 font-semibold" variant="ghost">
//                 {singleJob?.position} Positions
//               </Badge>

//               <Badge className="text-[#F83002] font-semibold" variant="ghost">
//                 {singleJob?.jobType}
//               </Badge>

//               <Badge className="text-[#7209b7] font-semibold" variant="ghost">
//                 {singleJob?.salary} LPA
//               </Badge>
//             </div>
//           </div>

//           <Button
//             onClick={applyJobHandler}
//             disabled={isApplied}
//             className={`rounded-xl px-6 py-2 transition-all cursor-pointer
//               ${
//                 isApplied
//                   ? "bg-gray-500 cursor-not-allowed"
//                   : "bg-[#7209b7] hover:bg-[#5f32ad]"
//               }`}
//           >
//             {isApplied ? "Already Applied" : "Apply Now"}
//           </Button>
//         </div>

//         {/* Divider */}
//         <div className="border-b my-6" />

//         {/* Job Details */}
//         <div className="space-y-4 text-gray-700">
//           <p>
//             <span className="font-semibold">Role:</span> {singleJob?.title}
//           </p>

//           <p>
//             <span className="font-semibold">Location:</span>{" "}
//             {singleJob?.location}
//           </p>

//           <p>
//             <span className="font-semibold">Description:</span>
//             <span className="block mt-1 text-gray-600 leading-relaxed">
//               {singleJob?.description}
//             </span>
//           </p>

//           <p>
//             <span className="font-semibold">Experience:</span>{" "}
//             {singleJob?.experienceLevel} yrs
//           </p>

//           <p>
//             <span className="font-semibold">Salary:</span>{" "}
//             {singleJob?.salary} LPA
//           </p>

//           <p>
//             <span className="font-semibold">Total Applicants:</span>{" "}
//             {singleJob?.applications?.length || 0}
//           </p>

//           <p>
//             <span className="font-semibold">Posted Date:</span>{" "}
//             {formattedDate}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobDescription;


import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { APPLICATION_API_ENDPOINT, Job_API_ENDPOINT } from "./utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "../redux/jobSlice";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Users, Star } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ---------------- APPLY JOB ---------------- */
  const applyJobHandler = async () => {
    if (isApplied) return;
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...singleJob.applications,
            { applicant: user?._id },
          ],
        };

        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  /* ---------------- FETCH JOB ---------------- */
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${Job_API_ENDPOINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const applied = res.data.job.applications.some(
            (application) =>
              application.applicant.toString() === user?._id
          );

          setIsApplied(applied);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const formattedDate = singleJob?.createdAt
    ? singleJob.createdAt.split("T")[0]
    : "-";

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* ===== BACK BUTTON ===== */}
        <button
          onClick={() => navigate("/")}
          className="
            flex items-center gap-2 mb-5 sm:mb-6
            text-sm font-medium text-gray-500
            hover:text-[#6A38C2] transition-colors duration-200
          "
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* ===== CARD ===== */}
        <div className="bg-white rounded-2xl shadow-md border p-5 sm:p-6 lg:p-8">

          {/* ===== HEADER ===== */}
          {/* Stack on mobile, row on md+ */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-5 md:gap-6">

            {/* Title + Badges */}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-snug">
                {singleJob?.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge className="text-blue-700 font-semibold text-xs sm:text-sm" variant="ghost">
                  {singleJob?.position} Positions
                </Badge>
                <Badge className="text-[#F83002] font-semibold text-xs sm:text-sm" variant="ghost">
                  {singleJob?.jobType}
                </Badge>
                <Badge className="text-[#7209b7] font-semibold text-xs sm:text-sm" variant="ghost">
                  {singleJob?.salary} LPA
                </Badge>
              </div>
            </div>

            {/* Apply Button — full width on mobile, auto on md+ */}
            <Button
              onClick={applyJobHandler}
              disabled={isApplied}
              className={`
                w-full md:w-auto shrink-0
                rounded-xl px-6 py-2 transition-all text-sm sm:text-base
                ${isApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad] cursor-pointer"
                }
              `}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>

          {/* Divider */}
          <div className="border-b my-5 sm:my-6" />

          {/* ===== JOB DETAILS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-gray-700">

            {/* Role */}
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
              <Briefcase size={16} className="text-[#6A38C2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Role</p>
                <p className="text-sm sm:text-base font-medium">{singleJob?.title}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
              <MapPin size={16} className="text-[#6A38C2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-sm sm:text-base font-medium">{singleJob?.location}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
              <Star size={16} className="text-[#6A38C2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Experience</p>
                <p className="text-sm sm:text-base font-medium">{singleJob?.experienceLevel} yrs</p>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
              <DollarSign size={16} className="text-[#6A38C2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Salary</p>
                <p className="text-sm sm:text-base font-medium">{singleJob?.salary} LPA</p>
              </div>
            </div>

            {/* Total Applicants */}
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
              <Users size={16} className="text-[#6A38C2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Total Applicants</p>
                <p className="text-sm sm:text-base font-medium">{singleJob?.applications?.length || 0}</p>
              </div>
            </div>

            {/* Posted Date */}
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50">
              <Calendar size={16} className="text-[#6A38C2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Posted Date</p>
                <p className="text-sm sm:text-base font-medium">{formattedDate}</p>
              </div>
            </div>

            {/* Description — full width */}
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 sm:col-span-2">
              <Briefcase size={16} className="text-[#6A38C2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {singleJob?.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;