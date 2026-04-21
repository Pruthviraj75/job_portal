// import React, { useEffect, useState } from "react";
// import Navbar from "../shared/Navbar";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { useSelector } from "react-redux";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { toast } from "sonner";
// import { Job_API_ENDPOINT } from "../utils/constant";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router";
// import { Loader2 } from "lucide-react";

// const PostJob = () => {
//   const { singleJob } = useSelector((store) => store.job);
//   const { companies } = useSelector((store) => store.company);

  
//   const { id } = useParams(); // edit mode
//   const navigate = useNavigate();

//   const [input, setInput] = useState({
//     title: "",
//     description: "",
//     requirements: "",
//     salary: "",
//     location: "",
//     jobType: "",
//     experience: "",
//     position: 0,
//     companyId: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // form change

//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   const selectChangeHandler = (value) => {
//     const selectedCompany = companies.find(
//       (company) => company.name.toLowerCase() === value
//     );
//     setInput({ ...input, companyId: selectedCompany._id });
//   };

//   // SUBMIT (CREATE + EDIT)

//   const submitHandler = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     let res;

//     if (id) {
//       // EDIT
//       res = await axios.put(`${Job_API_ENDPOINT}/update/${id}`, input, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });
//     } else {
//       // CREATE
//       res = await axios.post(`${Job_API_ENDPOINT}/post`, input, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });
//     }

//     if (res.data.success) {
//       toast.success(res.data.message);
//       navigate("/admin/jobs");
//     }
//   } catch (error) {
//     toast.error(error.response?.data?.message);
//   } finally {
//     setLoading(false);
//   }
// };


//   // PREFILL WHEN EDITING

//   useEffect(() => {
//     if (!singleJob) return;

//     setInput({
//       title: singleJob.title || "",
//       description: singleJob.description || "",
//       requirements: singleJob.requirements || "",
//       salary: singleJob.salary || "",
//       location: singleJob.location || "",
//       jobType: singleJob.jobType || "",
//       experience: singleJob.experienceLevel || "",
//       position: singleJob.position || 0,
//       companyId: singleJob.company || "",
//     });
//   }, [singleJob]);

//   // UI

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="flex items-center justify-center py-20 px-4">
//         <form
//           onSubmit={submitHandler}
//           className="p-8 max-w-4xl w-full bg-white rounded-2xl shadow-md border"
//         >
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Title</Label>
//               <Input name="title" value={input.title} onChange={changeEventHandler} />
//             </div>

//             <div>
//               <Label>Description</Label>
//               <Input name="description" value={input.description} onChange={changeEventHandler} />
//             </div>

//             <div>
//               <Label>Requirements</Label>
//               <Input name="requirements" value={input.requirements} onChange={changeEventHandler} />
//             </div>

//             <div>
//               <Label>Salary</Label>
//               <Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} />
//             </div>

//             <div>
//               <Label>Location</Label>
//               <Input name="location" value={input.location} onChange={changeEventHandler} />
//             </div>

//             <div>
//               <Label>Job Type</Label>
//               <Input name="jobType" value={input.jobType} onChange={changeEventHandler} />
//             </div>

//             <div>
//               <Label>Experience Level</Label>
//               <Input name="experience" value={input.experience} onChange={changeEventHandler} />
//             </div>

//             <div>
//               <Label>No of Position</Label>
//               <Input type="number" name="position" value={input.position} onChange={changeEventHandler} />
//             </div>

//             {companies.length > 0 && (
//               <Select onValueChange={selectChangeHandler}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a Company" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {companies.map((company) => (
//                     <SelectItem key={company._id} value={company.name.toLowerCase()}>
//                       {company.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           </div>

//           {loading ? (
//             <Button className="w-full mt-6">
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Please Wait
//             </Button>
//           ) : (
//             <Button type="submit" className="w-full mt-6">
//               {id ? "Update Job" : "Post New Job"}
//             </Button>
//           )}

//           {companies.length === 0 && (
//             <p className="text-xs text-red-600 font-bold text-center mt-4">
//               Please register a company first, before posting a job
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PostJob;



import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Job_API_ENDPOINT } from "../utils/constant";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Loader2, ArrowLeft } from "lucide-react";

const PostJob = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { companies } = useSelector((store) => store.company);

  const { id } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  /* ---------------- SUBMIT ---------------- */
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let res;
      if (id) {
        res = await axios.put(`${Job_API_ENDPOINT}/update/${id}`, input, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${Job_API_ENDPOINT}/post`, input, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PREFILL (EDIT MODE) ---------------- */
  useEffect(() => {
    if (!singleJob) return;
    setInput({
      title: singleJob.title || "",
      description: singleJob.description || "",
      requirements: singleJob.requirements || "",
      salary: singleJob.salary || "",
      location: singleJob.location || "",
      jobType: singleJob.jobType || "",
      experience: singleJob.experienceLevel || "",
      position: singleJob.position || 0,
      companyId: singleJob.company || "",
    });
  }, [singleJob]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-10">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border p-5 sm:p-6 lg:p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/jobs")}
              className="w-full sm:w-auto rounded-xl text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {id ? "Edit Job" : "Post New Job"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {id
                  ? "Update the details of this job posting"
                  : "Fill in the details to create a new job posting"}
              </p>
            </div>
          </div>

          {/* No company warning */}
          {companies.length === 0 && (
            <div className="mb-5 sm:mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs sm:text-sm text-red-600 font-medium text-center">
                Please register a company first, before posting a job.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">

            {/* 2-col on md+, 1-col on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

              <div className="space-y-1.5">
                <Label className="text-sm">Title</Label>
                <Input
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="e.g. Frontend Developer"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Description</Label>
                <Input
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Brief job description"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Requirements</Label>
                <Input
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="e.g. React, Node.js"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Salary</Label>
                <Input
                  type="number"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="e.g. 50000"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Location</Label>
                <Input
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="e.g. Mumbai, India"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Job Type</Label>
                <Input
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  placeholder="e.g. Full-time, Remote"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Experience Level</Label>
                <Input
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="e.g. 2+ years"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">No. of Positions</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="e.g. 3"
                  className="text-sm"
                />
              </div>

              {/* Company select — spans both cols on md+ */}
              {companies.length > 0 && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm">Company</Label>
                  <Select onValueChange={selectChangeHandler}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select a Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                          className="text-sm"
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7209b7] hover:bg-[#5f32ad] text-white rounded-xl text-sm h-10 sm:h-11 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                id ? "Update Job" : "Post New Job"
              )}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;