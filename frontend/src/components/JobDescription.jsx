import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import axios from "axios";
import { APPLICATION_API_ENDPOINT, Job_API_ENDPOINT } from "./utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "../redux/jobSlice";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

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
            (application) => application.applicant.toString() === user?._id
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
    <div className="max-w-5xl mx-auto my-12 px-4">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md border p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold mb-3">
              {singleJob?.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              <Badge className="text-blue-700 font-semibold" variant="ghost">
                {singleJob?.position} Positions
              </Badge>

              <Badge className="text-[#F83002] font-semibold" variant="ghost">
                {singleJob?.jobType}
              </Badge>

              <Badge className="text-[#7209b7] font-semibold" variant="ghost">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>

          <Button
            onClick={applyJobHandler}
            disabled={isApplied}
            className={`rounded-xl px-6 py-2 transition-all cursor-pointer
              ${
                isApplied
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad]"
              }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        {/* Divider */}
        <div className="border-b my-6" />

        {/* Job Details */}
        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Role:</span> {singleJob?.title}
          </p>

          <p>
            <span className="font-semibold">Location:</span>{" "}
            {singleJob?.location}
          </p>

          <p>
            <span className="font-semibold">Description:</span>
            <span className="block mt-1 text-gray-600 leading-relaxed">
              {singleJob?.description}
            </span>
          </p>

          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {singleJob?.experienceLevel} yrs
          </p>

          <p>
            <span className="font-semibold">Salary:</span>{" "}
            {singleJob?.salary} LPA
          </p>

          <p>
            <span className="font-semibold">Total Applicants:</span>{" "}
            {singleJob?.applications?.length || 0}
          </p>

          <p>
            <span className="font-semibold">Posted Date:</span>{" "}
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
