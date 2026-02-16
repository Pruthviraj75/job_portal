import React from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="
        group cursor-pointer
        rounded-2xl border border-gray-200 bg-white
        p-5 h-full
        flex flex-col
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
      "
    >
      {/* Company */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={job?.company?.logo} alt="Company logo" />
        </Avatar>

        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {job?.company?.name}
          </h2>
          <p className="text-xs text-gray-500">India</p>
        </div>
      </div>

      {/* Job Info */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#6A38C2] transition">
          {job?.title}
        </h3>

        {/* Fixed-height description area */}
        <p className="mt-1 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
          {job?.description}
        </p>
      </div>

      {/* Push badges to bottom */}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs font-medium">
          {job?.position} Positions
        </Badge>

        <Badge
          variant="outline"
          className="text-[#6A38C2] border-[#6A38C2] font-medium"
        >
          {job?.jobType}
        </Badge>

        <Badge className={"text-[#7209b7] border-[#6A38C2] font-bold"} variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
