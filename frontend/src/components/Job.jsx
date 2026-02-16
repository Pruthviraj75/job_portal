import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { SAVED_JOBS_API_ENDPOINT } from "./utils/constant";
import { setSavedJobs } from "../redux/savedJobSlice";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // safe default
  const allSavedJobs =
    useSelector((store) => store.savedJob?.allSavedJobs) || [];

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    return Math.floor((currentTime - createdAt) / (1000 * 24 * 60 * 60));
  };

  const isSaved = allSavedJobs.some(
    (item) => item?.job?._id === job?._id
  );

  const handleBookmark = async () => {
    try {
      if (isSaved) {
        // ---------- UNSAVE ----------
        await axios.delete(
          `${SAVED_JOBS_API_ENDPOINT}/unsave/${job._id}`,
          { withCredentials: true }
        );

        dispatch(
          setSavedJobs(
            allSavedJobs.filter((item) => item.job._id !== job._id)
          )
        );

        toast.success("Removed from saved jobs");
      } else {
        // ---------- SAVE ----------
        await axios.post(
          `${SAVED_JOBS_API_ENDPOINT}/save`,
          { jobId: job._id },
          { withCredentials: true }
        );

        dispatch(setSavedJobs([...allSavedJobs, { job }]));

        toast.success("Job saved successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="h-full flex flex-col p-6 rounded-2xl bg-white border shadow-sm hover:-translate-y-1 hover:shadow-lg transition">
      {/* Top */}
      <div className="flex justify-between text-sm text-gray-500">
        <p>
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        <Button
          size="icon"
          variant="secondary"
          onClick={handleBookmark}
          className="rounded-full text-[#6A38C2]"
        >
          <Bookmark size={16} fill={isSaved ? "#6A38C2" : "none"} />
        </Button>
      </div>

      {/* Company */}
      <div className="flex items-center gap-3 mt-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={job?.company?.logo} />
        </Avatar>

        <div>
          <h1 className="font-medium">{job?.company?.name}</h1>
          <p className="text-xs text-gray-500">India</p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 flex-1">
        <h1 className="font-semibold text-lg">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge variant="secondary" className="text-xs">
          {job?.position} Positions
        </Badge>

        <Badge
          variant="outline"
          className="text-[#6A38C2] border-[#6A38C2]"
        >
          {job?.jobType}
        </Badge>

        <Badge className={"text-[#7209b7] border-[#6A38C2] font-bold"} variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>

      {/* Details */}
      <Button
        variant="outline"
        className="mt-5 border-[#6A38C2] text-[#7209b7]"
        onClick={() => navigate(`/description/${job?._id}`)}
      >
        Details
      </Button>
    </div>
  );
};

export default Job;
